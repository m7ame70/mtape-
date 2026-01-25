import ServicesContent from "@/components/ServicesContent";

interface ServiceType {
    _id: string;
    title: string;
    description: string;
    image: string;
    price?: number;
}

async function getServices() {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/services`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch services", error);
        return [];
    }
}

export default async function ServicesPage() {
    const services: ServiceType[] = await getServices();

    return <ServicesContent services={services} />;
}
