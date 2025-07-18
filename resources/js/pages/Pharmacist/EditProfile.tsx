import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Upload, X } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

// Define the type for the pharmacist data coming from props
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
    avatar?: string;
    specializations?: string[];
    certifications?: string[];
    qualification?: string;
    university?: string;
    graduation_year?: number;
    years_experience?: number;
    languages?: string[];
    license_status?: string;
    license_expiry?: string;
    pharmacy_id?: number;
    profile_completed?: boolean;
    pharmacy?: {
        id: number;
        name: string;
        physical_address?: string;
    };
}

// Define the pharmacy interface
interface Pharmacy {
    id: number;
    name: string;
    physical_address?: string;
}

// Define the props interface for the component
interface EditProfileProps {
    pharmacist: PharmacistData;
    pharmacies: Pharmacy[];
    specialization_options: string[];
    language_options: string[];
    license_status_options: string[];
}

const EditProfile = ({ pharmacist, pharmacies, specialization_options, language_options, license_status_options }: EditProfileProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        // Note: name and email are not included in form data since they cannot be updated
        surname: pharmacist.surname || '',
        id_number: pharmacist.id_number || '',
        phone_number: pharmacist.phone_number || '',
        registration_number: pharmacist.registration_number || '',
        registration_date: pharmacist.registration_date || '',
        bio: pharmacist.bio || '',
        specializations: pharmacist.specializations || [],
        certifications: pharmacist.certifications || [],
        qualification: pharmacist.qualification || '',
        university: pharmacist.university || '',
        graduation_year: pharmacist.graduation_year || '',
        years_experience: pharmacist.years_experience || 0,
        languages: pharmacist.languages || [],
        license_status: pharmacist.license_status || 'active',
        license_expiry: pharmacist.license_expiry || '',
        pharmacy_id: pharmacist.pharmacy_id ? pharmacist.pharmacy_id.toString() : 'none',
        avatar: null as File | null,
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Debug: Log what we're sending
        console.log('Form data being sent:', data);

        // Temporarily use POST to test if PUT is the issue
        post(route('pharmacist.profile.update.post'), {
            onSuccess: () => {
                console.log('Update successful');
            },
            onError: (errors: Record<string, string>) => {
                console.log('Update errors:', errors);
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const addSpecialization = (specialization: string) => {
        if (!data.specializations.includes(specialization)) {
            setData('specializations', [...data.specializations, specialization]);
        }
    };

    const removeSpecialization = (index: number) => {
        setData(
            'specializations',
            data.specializations.filter((_, i) => i !== index),
        );
    };

    const addLanguage = (language: string) => {
        if (!data.languages.includes(language)) {
            setData('languages', [...data.languages, language]);
        }
    };

    const removeLanguage = (index: number) => {
        setData(
            'languages',
            data.languages.filter((_, i) => i !== index),
        );
    };

    const addCertification = () => {
        setData('certifications', [...data.certifications, '']);
    };

    const updateCertification = (index: number, value: string) => {
        const newCertifications = [...data.certifications];
        newCertifications[index] = value;
        setData('certifications', newCertifications);
    };

    const removeCertification = (index: number) => {
        setData(
            'certifications',
            data.certifications.filter((_, i) => i !== index),
        );
    };

    return (
        <AppLayout>
            <Head title={!pharmacist.profile_completed ? 'Complete Your Profile' : 'Edit Pharmacist Profile'} />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {!pharmacist.profile_completed && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-blue-900">Welcome to the e-Prescription System!</h3>
                                    <p className="text-blue-800">
                                        Please complete your profile to get started. This information helps us provide you with the best experience
                                        and ensures proper identification.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={previewUrl || pharmacist.avatar} alt={`${pharmacist.name} ${pharmacist.surname || ''}`} />
                                    <AvatarFallback className="text-lg">
                                        {pharmacist.name.charAt(0)}
                                        {pharmacist.surname?.charAt(0) || ''}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload New Picture
                                    </Button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    <p className="text-muted-foreground mt-1 text-sm">JPG, PNG, GIF up to 2MB</p>
                                    {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={pharmacist.name}
                                        readOnly
                                        disabled
                                        className="cursor-not-allowed bg-gray-50 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500">Name cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="surname">Surname</Label>
                                    <Input id="surname" value={data.surname} onChange={(e) => setData('surname', e.target.value)} />
                                    {errors.surname && <p className="text-sm text-red-600">{errors.surname}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={pharmacist.email}
                                        readOnly
                                        disabled
                                        className="cursor-not-allowed bg-gray-50 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} />
                                    {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_number">ID Number</Label>
                                    <Input id="id_number" value={data.id_number} onChange={(e) => setData('id_number', e.target.value)} />
                                    {errors.id_number && <p className="text-sm text-red-600">{errors.id_number}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                                {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="registration_number">Registration Number</Label>
                                    <Input
                                        id="registration_number"
                                        value={data.registration_number}
                                        onChange={(e) => setData('registration_number', e.target.value)}
                                    />
                                    {errors.registration_number && <p className="text-sm text-red-600">{errors.registration_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="registration_date">Registration Date</Label>
                                    <Input
                                        id="registration_date"
                                        type="date"
                                        value={data.registration_date}
                                        onChange={(e) => setData('registration_date', e.target.value)}
                                    />
                                    {errors.registration_date && <p className="text-sm text-red-600">{errors.registration_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input
                                        id="qualification"
                                        value={data.qualification}
                                        onChange={(e) => setData('qualification', e.target.value)}
                                        placeholder="e.g., Bachelor of Pharmacy"
                                    />
                                    {errors.qualification && <p className="text-sm text-red-600">{errors.qualification}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="university">University</Label>
                                    <Input id="university" value={data.university} onChange={(e) => setData('university', e.target.value)} />
                                    {errors.university && <p className="text-sm text-red-600">{errors.university}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="graduation_year">Graduation Year</Label>
                                    <Input
                                        id="graduation_year"
                                        type="number"
                                        min="1950"
                                        max={new Date().getFullYear() + 5}
                                        value={data.graduation_year}
                                        onChange={(e) => setData('graduation_year', parseInt(e.target.value) || '')}
                                    />
                                    {errors.graduation_year && <p className="text-sm text-red-600">{errors.graduation_year}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="years_experience">Years of Experience</Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        min="0"
                                        max="60"
                                        value={data.years_experience}
                                        onChange={(e) => setData('years_experience', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.years_experience && <p className="text-sm text-red-600">{errors.years_experience}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="license_status">License Status</Label>
                                    <Select value={data.license_status} onValueChange={(value) => setData('license_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select license status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {license_status_options.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.license_status && <p className="text-sm text-red-600">{errors.license_status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="license_expiry">License Expiry Date</Label>
                                    <Input
                                        id="license_expiry"
                                        type="date"
                                        value={data.license_expiry}
                                        onChange={(e) => setData('license_expiry', e.target.value)}
                                    />
                                    {errors.license_expiry && <p className="text-sm text-red-600">{errors.license_expiry}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pharmacy_id">Assigned Pharmacy</Label>
                                    <Select value={data.pharmacy_id} onValueChange={(value) => setData('pharmacy_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a pharmacy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No pharmacy assigned</SelectItem>
                                            {pharmacies.map((pharmacy) => (
                                                <SelectItem key={pharmacy.id} value={pharmacy.id.toString()}>
                                                    {pharmacy.name}
                                                    {pharmacy.physical_address && (
                                                        <span className="block text-sm text-gray-500">{pharmacy.physical_address}</span>
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pharmacy_id && <p className="text-sm text-red-600">{errors.pharmacy_id}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specializations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Specializations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {data.specializations.map((spec, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {spec}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground h-auto p-0"
                                            onClick={() => removeSpecialization(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <Select onValueChange={addSpecialization}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add a specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {specialization_options
                                        .filter((spec) => !data.specializations.includes(spec))
                                        .map((spec) => (
                                            <SelectItem key={spec} value={spec}>
                                                {spec}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.specializations && <p className="text-sm text-red-600">{errors.specializations}</p>}
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {data.languages.map((lang, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                        {lang}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground h-auto p-0"
                                            onClick={() => removeLanguage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <Select onValueChange={addLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add a language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {language_options
                                        .filter((lang) => !data.languages.includes(lang))
                                        .map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.languages && <p className="text-sm text-red-600">{errors.languages}</p>}
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Certifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Input
                                        value={cert}
                                        onChange={(e) => updateCertification(index, e.target.value)}
                                        placeholder="Enter certification name"
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addCertification} className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Certification
                            </Button>
                            {errors.certifications && <p className="text-sm text-red-600">{errors.certifications}</p>}
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2">
                        {pharmacist.profile_completed && (
                            <Button variant="outline" type="button" asChild>
                                <Link href={route('pharmacist.profile')}>Cancel</Link>
                            </Button>
                        )}
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : !pharmacist.profile_completed ? 'Complete Profile & Get Started' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default EditProfile;
