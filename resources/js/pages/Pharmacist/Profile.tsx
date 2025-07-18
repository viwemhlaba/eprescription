import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Award, BookOpen, Building, Calendar, Globe, Mail, Phone, User } from 'lucide-react';

// Define the type for pharmacist data from the controller
interface PharmacistData {
    id: number;
    name: string;
    email: string;
    surname?: string;
    id_number?: string;
    phone_number?: string;
    registration_number?: string;
    registration_date?: string;
    bio?: string;
    avatar_url?: string;
    specializations?: string[];
    certifications?: string[];
    qualification?: string;
    university?: string;
    graduation_year?: number;
    years_experience?: number;
    languages?: string[];
    license_status?: string;
    license_expiry?: string;
    license_expiring_soon?: boolean;
    years_since_registration?: number;
    created_at: string;
    pharmacy?: {
        id: number;
        name: string;
        health_council_registration_number?: string;
        physical_address?: string;
        contact_number?: string;
        email?: string;
        website_url?: string;
    } | null;
}

interface Statistics {
    total_prescriptions: number;
    pending_prescriptions: number;
    approved_prescriptions: number;
    dispensed_prescriptions: number;
    recent_activity: number;
    monthly_trends: Array<{ month: string; count: number }>;
    approval_rate: number;
}

interface PharmacistProfileProps {
    pharmacist: PharmacistData;
    statistics: Statistics;
}

const PharmacistProfile = ({ pharmacist, statistics }: PharmacistProfileProps) => {
    const getLicenseStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'suspended':
                return 'bg-orange-100 text-orange-800';
            case 'probation':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Pharmacist Profile" />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Section with Avatar and Basic Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={pharmacist.avatar_url} alt={`${pharmacist.name} ${pharmacist.surname || ''}`} />
                                <AvatarFallback className="text-lg">
                                    {pharmacist.name.charAt(0)}
                                    {pharmacist.surname?.charAt(0) || ''}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">
                                    {pharmacist.name} {pharmacist.surname}
                                </h1>
                                <p className="text-muted-foreground">{pharmacist.qualification || 'Pharmacist'}</p>
                                <div className="mt-2 flex items-center space-x-4">
                                    <Badge className={getLicenseStatusColor(pharmacist.license_status || 'active')}>
                                        {pharmacist.license_status?.toUpperCase() || 'ACTIVE'}
                                    </Badge>
                                    {pharmacist.license_expiring_soon && (
                                        <Badge variant="destructive" className="flex items-center space-x-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span>License Expiring Soon</span>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button asChild>
                                <Link href={route('pharmacist.profile.edit')}>Edit Profile</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    {pharmacist.bio && (
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{pharmacist.bio}</p>
                        </CardContent>
                    )}
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Statistics Cards */}
                    <div className="space-y-4 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{statistics.total_prescriptions}</div>
                                        <div className="text-muted-foreground text-xs">Total Processed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{statistics.approval_rate}%</div>
                                        <div className="text-muted-foreground text-xs">Approval Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{statistics.pending_prescriptions}</div>
                                        <div className="text-muted-foreground text-xs">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{statistics.recent_activity}</div>
                                        <div className="text-muted-foreground text-xs">Last 30 Days</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">{pharmacist.years_experience} years experience</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <User className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Member since {pharmacist.created_at}</span>
                                </div>
                                {pharmacist.university && (
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm">
                                            {pharmacist.university} ({pharmacist.graduation_year})
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Profile Information */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Personal Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div id="name" className="text-sm font-medium">
                                            {pharmacist.name} {pharmacist.surname}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="idNumber">ID Number</Label>
                                        <div id="idNumber" className="text-sm font-medium">
                                            {pharmacist.id_number || 'Not provided'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center space-x-1">
                                            <Mail className="h-4 w-4" />
                                            <span>Email Address</span>
                                        </Label>
                                        <div id="email" className="text-sm font-medium">
                                            {pharmacist.email}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center space-x-1">
                                            <Phone className="h-4 w-4" />
                                            <span>Phone Number</span>
                                        </Label>
                                        <div id="phone" className="text-sm font-medium">
                                            {pharmacist.phone_number || 'Not provided'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Award className="h-5 w-5" />
                                    <span>Professional Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="registration">Registration Number</Label>
                                        <div id="registration" className="text-sm font-medium">
                                            {pharmacist.registration_number || 'Not provided'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registrationDate">Registration Date</Label>
                                        <div id="registrationDate" className="text-sm font-medium">
                                            {pharmacist.registration_date || 'Not provided'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license">License Status</Label>
                                        <div id="license" className="text-sm font-medium">
                                            <Badge className={getLicenseStatusColor(pharmacist.license_status || 'active')}>
                                                {pharmacist.license_status?.toUpperCase() || 'ACTIVE'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="licenseExpiry">License Expiry</Label>
                                        <div id="licenseExpiry" className="text-sm font-medium">
                                            {pharmacist.license_expiry || 'Not provided'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pharmacy Details */}
                        {pharmacist.pharmacy && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Building className="h-5 w-5" />
                                        <span>Pharmacy Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                                            <div id="pharmacyName" className="text-sm font-medium">
                                                {pharmacist.pharmacy.name}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pharmacyRegistration">Health Council Registration</Label>
                                            <div id="pharmacyRegistration" className="text-sm font-medium">
                                                {pharmacist.pharmacy.health_council_registration_number || 'Not provided'}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pharmacyAddress">Physical Address</Label>
                                            <div id="pharmacyAddress" className="text-sm font-medium">
                                                {pharmacist.pharmacy.physical_address || 'Not provided'}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pharmacyContact">Contact Number</Label>
                                            <div id="pharmacyContact" className="text-sm font-medium">
                                                {pharmacist.pharmacy.contact_number || 'Not provided'}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pharmacyEmail" className="flex items-center space-x-1">
                                                <Mail className="h-4 w-4" />
                                                <span>Email Address</span>
                                            </Label>
                                            <div id="pharmacyEmail" className="text-sm font-medium">
                                                {pharmacist.pharmacy.email || 'Not provided'}
                                            </div>
                                        </div>

                                        {pharmacist.pharmacy.website_url && (
                                            <div className="space-y-2">
                                                <Label htmlFor="pharmacyWebsite" className="flex items-center space-x-1">
                                                    <Globe className="h-4 w-4" />
                                                    <span>Website</span>
                                                </Label>
                                                <div id="pharmacyWebsite" className="text-sm font-medium">
                                                    <a
                                                        href={pharmacist.pharmacy.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {pharmacist.pharmacy.website_url}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {!pharmacist.pharmacy && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Building className="h-5 w-5" />
                                        <span>Pharmacy Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        No pharmacy assigned. Please contact your administrator to assign you to a pharmacy.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Specializations & Languages */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Specializations */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Award className="h-5 w-5" />
                                        <span>Specializations</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pharmacist.specializations && pharmacist.specializations.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {pharmacist.specializations.map((spec, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {spec}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No specializations listed</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Languages */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Globe className="h-5 w-5" />
                                        <span>Languages</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pharmacist.languages && pharmacist.languages.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {pharmacist.languages.map((lang, index) => (
                                                <Badge key={index} variant="outline">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No languages listed</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Certifications */}
                        {pharmacist.certifications && pharmacist.certifications.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Certifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {pharmacist.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Award className="text-muted-foreground h-4 w-4" />
                                                <span className="text-sm">{cert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PharmacistProfile;
