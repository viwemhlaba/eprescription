<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Medication\Medication;
use App\Models\MedicationSupplier;
use App\Models\StockOrder;
use App\Models\StockOrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    private function createManager(): User
    {
        return User::factory()->create(['role' => 'manager']);
    }

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_manager_can_view_create_stock_order_page()
    {
        $manager = $this->createManager();

        $response = $this->actingAs($manager)->get(route('manager.orders.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Manager/Orders/CreateStockOrder'));
    }

    public function test_manager_can_create_stock_order()
    {
        $manager = $this->createManager();
        $supplier = MedicationSupplier::factory()->create();
        $medications = Medication::factory()->count(3)->create(['supplier_id' => $supplier->id, 'quantity_on_hand' => 5, 'reorder_level' => 10]);

        $orderData = [
            'medications' => [
                ['id' => $medications[0]->id, 'quantity' => 20],
                ['id' => $medications[1]->id, 'quantity' => 30],
            ]
        ];

        $response = $this->actingAs($manager)->post(route('manager.orders.store'), $orderData);

        $response->assertRedirect(route('manager.orders.index'));
        $this->assertDatabaseCount('stock_orders', 1);
        $this->assertDatabaseCount('stock_order_items', 2);
    }

    public function test_manager_can_view_stock_order_index_page()
    {
        $manager = $this->createManager();
        for ($i = 0; $i < 5; $i++) {
            StockOrder::factory()->create();
        }

        $response = $this->actingAs($manager)->get(route('manager.orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Manager/Orders/Index')->has('orders.data', 5));
    }

    public function test_manager_can_mark_order_as_received()
    {
        $manager = $this->createManager();
        $order = StockOrder::factory()->create(['status' => 'Pending']);
        $orderItem = StockOrderItem::factory()->create(['stock_order_id' => $order->id, 'quantity' => 10]);
        $medication = $orderItem->medication;
        $initialStock = $medication->quantity_on_hand;

        $response = $this->actingAs($manager)->patch(route('manager.orders.receive', $order));

        $response->assertRedirect(route('manager.orders.index'));
        $this->assertDatabaseHas('stock_orders', ['id' => $order->id, 'status' => 'Received']);
        $this->assertDatabaseHas('medications', ['id' => $medication->id, 'quantity_on_hand' => $initialStock + 10]);
    }
}
