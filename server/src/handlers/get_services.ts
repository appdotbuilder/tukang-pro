import { type Service, type HandymanType } from '../schema';

export async function getServices(): Promise<Service[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all services from the database.
    return [];
}

export async function getServicesByType(handymanType: HandymanType): Promise<Service[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching services by handyman type (carpenter or construction).
    // Used when customers want to see what services are available for specific handyman types.
    return [];
}

export async function getServiceById(id: number): Promise<Service | null> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching a specific service by its ID.
    // Used when displaying service details or creating orders.
    return null;
}