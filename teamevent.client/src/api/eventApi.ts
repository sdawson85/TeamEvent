import { Event } from "../models/event";
import {
  generateTenantIdFromBrowser,
  getTenantId,
  saveTenantId,
} from "../utils/tenant";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getEvents = async (): Promise<Event[]> => {
  let tenantId = getTenantId();
  if (!tenantId) {
    tenantId = generateTenantIdFromBrowser();
    saveTenantId(tenantId);
  }

  const response = await fetch(`${API_BASE}/TeamEvent/Index`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events.");
  }

  return response.json();
};

export const submitEvent = async (
  event: Omit<Event, "id">
): Promise<boolean> => {
  let tenantId = getTenantId();
  if (!tenantId) {
    tenantId = generateTenantIdFromBrowser();
    saveTenantId(tenantId);
  }

  const response = await fetch(`${API_BASE}/TeamEvent/AddEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
    body: JSON.stringify(event),
  });

  return response.ok;
};
