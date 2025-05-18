import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Mock data for provinces (replace with actual data fetching if needed)
const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manager Dashboard',
        href: '/manager/dashboard',
    },
    {
        title: 'Pharmacy Details',
        href: '/manager/pharmacy/details', // Corrected breadcrumb
    },
];

interface PharmacyDetails {
    name: string;
    registrationNumber: string;
    website?: string;
    responsiblePharmacist?: string; //  Link to Pharmacist ID
    vatRegistrationNumber?: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    operatingHours: {
        monday: { open: boolean; startTime: string; endTime: string };
        tuesday: { open: boolean; startTime: string; endTime: string };
        wednesday: { open: boolean; startTime: string; endTime: string };
        thursday: { open: boolean; startTime: string; endTime: string };
        friday: { open: boolean; startTime: string; endTime: string };
        saturday: { open: boolean; startTime: string; endTime: string };
        sunday: { open: boolean; startTime: string; endTime: string };
        publicHolidays: string;
    };
    logo?: string; // URL or base64
}

const initialDetails: PharmacyDetails = {
    name: "Ibhayi Pharmacy",
    registrationNumber: "HC12345", // Mock
    website: "https://www.ibhayipharmacy.co.za",
    responsiblePharmacist: "John Doe", // Mock
    vatRegistrationNumber: "1234567890",
    street: "123 Main Street",
    city: "Gqeberha",
    province: "Eastern Cape",
    postalCode: "6001",
    phone: "+27 41 123 4567",
    email: "info@ibhayipharmacy.co.za",
    operatingHours: {
        monday: { open: true, startTime: "08:00", endTime: "17:00" },
        tuesday: { open: true, startTime: "08:00", endTime: "17:00" },
        wednesday: { open: true, startTime: "08:00", endTime: "17:00" },
        thursday: { open: true, startTime: "08:00", endTime: "17:00" },
        friday: { open: true, startTime: "08:00", endTime: "17:00" },
        saturday: { open: true, startTime: "09:00", endTime: "13:00" },
        sunday: { open: false, startTime: "00:00", endTime: "00:00" },
        publicHolidays: "Closed",
    },
    logo: undefined,
};

export default function PharmacyDetailsPage() {
    const [details, setDetails] = useState<PharmacyDetails>(initialDetails);
    const [isEditing, setIsEditing] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | undefined>(initialDetails.logo);

    const handleInputChange = (section: keyof PharmacyDetails, field: string, value: any) => {
        setDetails(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleTopLevelInputChange = (field: keyof PharmacyDetails, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleHoursChange = (day: keyof PharmacyDetails['operatingHours'], field: 'open' | 'startTime' | 'endTime', value: any) => {
        setDetails(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [day]: {
                    ...prev.operatingHours[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setDetails(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview(undefined);
        setDetails(prev => ({ ...prev, logo: undefined }));
    };

    const handleSave = () => {
        //  Save to database or state
        setIsEditing(false);
        console.log("Saving Details:", details);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pharmacy Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl p-6 space-y-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        {/* Icon */}
                        <ClipboardList className="w-6 h-6" />
                        Ibhayi Pharmacy Details
                    </h1>

                    {isEditing ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="text-gray-200">Pharmacy Name</Label>
                                            <Input
                                                id="name"
                                                value={details.name}
                                                onChange={(e) => handleTopLevelInputChange('name', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="registrationNumber" className="text-gray-200">Health Council Registration No.</Label>
                                            <Input
                                                id="registrationNumber"
                                                value={details.registrationNumber}
                                                onChange={(e) => handleTopLevelInputChange('registrationNumber', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="website" className="text-gray-200">Website URL (Optional)</Label>
                                            <Input
                                                id="website"
                                                value={details.website || ""}
                                                onChange={(e) => handleTopLevelInputChange('website', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="responsiblePharmacist" className="text-gray-200">Responsible Pharmacist</Label>
                                            <Input
                                                id="responsiblePharmacist"
                                                value={details.responsiblePharmacist || ""}
                                                onChange={(e) => handleTopLevelInputChange('responsiblePharmacist', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="vatRegistrationNumber" className="text-gray-200">VAT Registration No. (Optional)</Label>
                                            <Input
                                                id="vatRegistrationNumber"
                                                value={details.vatRegistrationNumber || ""}
                                                onChange={(e) => handleTopLevelInputChange('vatRegistrationNumber', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Address */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Physical Address</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="street" className="text-gray-200">Street Address</Label>
                                            <Textarea
                                                id="street"
                                                value={details.street}
                                                onChange={(e) => handleTopLevelInputChange('street', e.target.value)}
                                                className="bg-black/20 text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city" className="text-gray-200">City/Town</Label>
                                                <Input
                                                    id="city"
                                                    value={details.city}
                                                    onChange={(e) => handleTopLevelInputChange('city', e.target.value)}
                                                    className="bg-black/20 text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="postalCode" className="text-gray-200">Postal Code</Label>
                                                <Input
                                                    id="postalCode"
                                                    value={details.postalCode}
                                                    onChange={(e) => handleTopLevelInputChange('postalCode', e.target.value)}
                                                    className="bg-black/20 text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="province" className="text-gray-200">Province/State</Label>
                                            <Select
                                                value={details.province}
                                                onValueChange={(value) => handleTopLevelInputChange('province', value)}
                                            >
                                                <SelectTrigger className="w-full bg-black/20 text-white">
                                                    <SelectValue placeholder="Select a province" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provinces.map(province => (
                                                        <SelectItem key={province} value={province} className="hover:bg-white/10">
                                                            {province}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-300 mb-4">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone" className="text-gray-200">Phone Number(s)</Label>
                                        <Input
                                            id="phone"
                                            value={details.phone}
                                            onChange={(e) => handleTopLevelInputChange('phone', e.target.value)}
                                            className="bg-black/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                                        <Input
                                            id="email"
                                            value={details.email}
                                            onChange={(e) => handleTopLevelInputChange('email', e.target.value)}
                                            className="bg-black/20 text-white"
                                            type="email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-300 mb-4">Operating Hours</h2>
                                <div className="space-y-4">
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                        <div key={day} className="flex items-center gap-4">
                                            <Label htmlFor={day} className="text-gray-200 capitalize w-20">{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                                            <div className="flex items-center gap-4 flex-1">
                                                <Label className="text-gray-200 mr-1">Open</Label>
                                                <input
                                                    type="checkbox"
                                                    id={day}
                                                    checked={details.operatingHours[day as keyof PharmacyDetails['operatingHours']].open}
                                                    onChange={(e) =>
                                                        handleHoursChange(
                                                            day as keyof PharmacyDetails['operatingHours'],
                                                            'open',
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                <Label className="text-gray-200">Start</Label>
                                                <Input
                                                    type="time"
                                                    value={details.operatingHours[day as keyof PharmacyDetails['operatingHours']].startTime}
                                                    onChange={(e) =>
                                                        handleHoursChange(
                                                            day as keyof PharmacyDetails['operatingHours'],
                                                            'startTime',
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!details.operatingHours[day as keyof PharmacyDetails['operatingHours']].open}
                                                    className={cn("bg-black/20 text-white w-24", !details.operatingHours[day as keyof PharmacyDetails['operatingHours']].open && "opacity-50 cursor-not-allowed")}
                                                />
                                                <Label className="text-gray-200">End</Label>
                                                <Input
                                                    type="time"
                                                    value={details.operatingHours[day as keyof PharmacyDetails['operatingHours']].endTime}
                                                    onChange={(e) =>
                                                        handleHoursChange(
                                                            day as keyof PharmacyDetails['operatingHours'],
                                                            'endTime',
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!details.operatingHours[day as keyof PharmacyDetails['operatingHours']].open}
                                                    className={cn("bg-black/20 text-white w-24", !details.operatingHours[day as keyof PharmacyDetails['operatingHours']].open && "opacity-50 cursor-not-allowed")}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div>
                                        <Label htmlFor="publicHolidays" className="text-gray-200">Public Holidays</Label>
                                        <Input
                                            id="publicHolidays"
                                            value={details.operatingHours.publicHolidays}
                                            onChange={(e) =>
                                                handleHoursChange(
                                                    'publicHolidays',
                                                    'publicHolidays',
                                                    e.target.value
                                                )
                                            }
                                            className="bg-black/20 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Logo */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-300 mb-4">Logo (Optional)</h2>
                                <div className="flex items-center gap-4">
                                    {logoPreview ? (
                                        <>
                                            <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-700">
                                                <img src={logoPreview} alt="Logo Preview" className="object-cover w-full h-full" />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleRemoveLogo}
                                                    className="absolute top-0.5 right-0.5 bg-red-500/50 text-white hover:bg-red-500/70"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-24 h-24 rounded-md border border-dashed border-gray-700 flex items-center justify-center">
                                            <span className="text-gray-400">No Logo</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="w-fit"
                                            id="logo-upload" // Add an ID for the label
                                        />
                                        <Label htmlFor="logo-upload" className="text-gray-400 text-sm">
                                            Recommended: 200x200px, PNG or JPG
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-gray-700/50 text-white hover:bg-gray-700">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600">
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200">Basic Information</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Pharmacy Name:</span> {details.name}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Health Council Registration No:</span> {details.registrationNumber}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Website URL:</span> {details.website || "N/A"}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Responsible Pharmacist:</span> {details.responsiblePharmacist || "N/A"}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">VAT Registration No:</span> {details.vatRegistrationNumber || "N/A"}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200">Physical Address</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Street Address:</span> {details.street}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">City/Town:</span> {details.city}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Province/State:</span> {details.province}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Postal Code:</span> {details.postalCode}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">Contact Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-400"><span className="font-medium text-gray-300">Phone Number(s):</span> {details.phone}</p>
                                    <p className="text-gray-400"><span className="font-medium text-gray-300">Email Address:</span> {details.email}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">Operating Hours</h3>
                                <div className="space-y-2">
                                    {Object.entries(details.operatingHours).filter(([key]) => key !== 'publicHolidays').map(([day, hours]) => (
                                        <p key={day} className="text-gray-400">
                                            <span className="font-medium text-gray-300">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                                            {hours.open ? ` ${hours.startTime} - ${hours.endTime}` : " Closed"}
                                        </p>
                                    ))}
                                    <p className="text-gray-400"><span className="font-medium text-gray-300">Public Holidays:</span> {details.operatingHours.publicHolidays}</p>
                                </div>
                            </div>
                            {details.logo && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200">Logo</h3>
                                    <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-700">
                                        <img src={details.logo} alt="Pharmacy Logo" className="object-cover w-full h-full" />
                                    </div>
                                </div>
                            )}

                            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white hover:bg-blue-600 w-fit">
                                Edit Details
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

