import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    Heart,
    Pill,
    RefreshCw,
    Shield,
    Star,
    Stethoscope,
    Users,
    Zap,
} from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Ibhayi E-Prescription System - Digital Healthcare Platform" />

            {/* Navigation */}
            <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Pill className="h-6 w-6" />
                        <span className="text-xl font-bold">Ibhayi</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link href={route('login')}>Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('register')}>Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="bg-background min-h-screen">
                {/* Hero Section */}
                <section className="py-24 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl text-center">
                            <Badge variant="secondary" className="mb-6">
                                <Zap className="mr-1 h-3 w-3" />
                                Next-Generation Healthcare Platform
                            </Badge>

                            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
                                Digital Prescription
                                <span className="text-muted-foreground block">Management Made Simple</span>
                            </h1>

                            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
                                Streamline your healthcare workflow with our comprehensive e-prescription platform. Secure, efficient, and designed
                                for modern healthcare delivery.
                            </p>

                            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
                                <Button size="lg" asChild>
                                    <Link href={route('register')}>
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href={route('login')}>Sign In</Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                                <div className="space-y-2">
                                    <Shield className="text-muted-foreground mx-auto h-8 w-8" />
                                    <h3 className="font-semibold">Bank-Level Security</h3>
                                    <p className="text-muted-foreground text-sm">End-to-end encryption</p>
                                </div>
                                <div className="space-y-2">
                                    <Clock className="text-muted-foreground mx-auto h-8 w-8" />
                                    <h3 className="font-semibold">24/7 Availability</h3>
                                    <p className="text-muted-foreground text-sm">Always accessible</p>
                                </div>
                                <div className="space-y-2">
                                    <CheckCircle className="text-muted-foreground mx-auto h-8 w-8" />
                                    <h3 className="font-semibold">Compliance Ready</h3>
                                    <p className="text-muted-foreground text-sm">HIPAA certified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Features Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <Badge variant="outline" className="mb-4">
                                Features
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold lg:text-5xl">
                                Everything you need for
                                <span className="block">modern healthcare</span>
                            </h2>
                            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                                Comprehensive tools designed to streamline every aspect of prescription management
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <FileText className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Digital Prescriptions</CardTitle>
                                    <CardDescription className="text-base">
                                        Seamless electronic prescription creation, management, and dispensing workflow
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <RefreshCw className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Repeat Management</CardTitle>
                                    <CardDescription className="text-base">
                                        Automated repeat prescription handling with intelligent approval systems
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Users className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Patient Profiles</CardTitle>
                                    <CardDescription className="text-base">
                                        Comprehensive patient management with complete medical history tracking
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Bell className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Smart Notifications</CardTitle>
                                    <CardDescription className="text-base">
                                        Real-time alerts for prescription status, collection reminders, and updates
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Heart className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Allergy Safety</CardTitle>
                                    <CardDescription className="text-base">
                                        Advanced allergy checking to prevent dangerous medication interactions
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-6 text-center">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Pill className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-xl transition-colors">Inventory Control</CardTitle>
                                    <CardDescription className="text-base">
                                        Real-time stock tracking with automated reorder notifications
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Target Audience Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <Badge variant="outline" className="mb-4">
                                For Everyone
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold lg:text-5xl">
                                Built for the entire
                                <span className="block">healthcare ecosystem</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <Card className="group border-border/50 hover:border-border cursor-pointer border text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Users className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-2xl transition-colors">Patients</CardTitle>
                                    <CardDescription className="text-base">
                                        Manage your prescriptions with ease and stay connected to your healthcare journey
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Easy repeat requests</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Complete medication history</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Collection notifications</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Allergy profile management</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Pill className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-2xl transition-colors">Pharmacists</CardTitle>
                                    <CardDescription className="text-base">
                                        Streamline operations with powerful tools for prescription and inventory management
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Digital prescription processing</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Advanced inventory management</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Patient safety verification</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Comprehensive reporting</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="group border-border/50 hover:border-border cursor-pointer border text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                                        <Stethoscope className="group-hover:text-primary h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary text-2xl transition-colors">Healthcare Providers</CardTitle>
                                    <CardDescription className="text-base">
                                        Enhance patient care with integrated prescription management and tracking
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Electronic prescription creation</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Patient medication history</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Seamless pharmacy integration</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span className="text-sm">Secure communication</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* CTA Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <Card className="bg-muted/50 mx-auto max-w-4xl border-0 text-center shadow-sm">
                            <CardHeader className="pb-8">
                                <Badge variant="default" className="mx-auto mb-4 w-fit">
                                    <Star className="mr-1 h-3 w-3" />
                                    Trusted by Healthcare Professionals
                                </Badge>
                                <CardTitle className="mb-4 text-3xl font-bold lg:text-4xl">Ready to transform your healthcare workflow?</CardTitle>
                                <CardDescription className="text-lg">
                                    Join thousands of healthcare professionals already using our platform to deliver better patient care
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
                                    <Button size="lg" asChild>
                                        <Link href={route('register')}>
                                            Start Free Trial
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href={route('login')}>Sign In to Your Account</Link>
                                    </Button>
                                </div>
                                <p className="text-muted-foreground text-sm">No credit card required • Setup in minutes • 24/7 support</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-muted/30 border-t">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="flex items-center gap-2">
                            <Pill className="h-6 w-6" />
                            <span className="text-xl font-bold">Ibhayi E-Prescription System</span>
                        </div>
                        <p className="text-muted-foreground max-w-md">
                            Empowering healthcare through digital innovation. Secure, efficient, and patient-centered solutions.
                        </p>
                        <Separator className="max-w-md" />
                        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Ibhayi Pharmacy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
