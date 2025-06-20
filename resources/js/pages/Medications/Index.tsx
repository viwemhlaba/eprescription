export default function Index({ medications = [] }) {
    // TODO: Add sorting/filtering logic
    return (
        <div>
            <h1>Medications</h1>
            <a href={route('medications.create')} className="btn btn-primary">
                Add Medication
            </a>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Schedule</th>
                        <th>Supplier</th>
                        <th>Reorder Level</th>
                        <th>Quantity On Hand</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map((med: any) => (
                        <tr key={med.id}>
                            <td>{med.name}</td>
                            <td>{med.schedule}</td>
                            <td>{med.supplier?.name}</td>
                            <td>{med.reorder_level}</td>
                            <td>{med.quantity_on_hand}</td>
                            <td>
                                <a href={route('medications.edit', med.id)} className="btn btn-sm btn-warning">
                                    Edit
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
