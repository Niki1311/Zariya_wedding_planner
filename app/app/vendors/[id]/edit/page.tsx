"use client";

import { useParams } from "next/navigation";
import { useWedding } from "@/lib/store";
import { VendorForm } from "@/components/vendors/VendorForm";
import { EmptyState } from "@/components/ui/primitives";

export default function EditVendorPage() {
  const { id } = useParams<{ id: string }>();
  const w = useWedding();
  const vendor = w.vendors.find((v) => v.id === id);
  if (!vendor) return <div className="mx-auto max-w-3xl py-12"><EmptyState title="Vendor not found" message="This vendor may have been deleted." /></div>;
  return <VendorForm vendor={vendor} />;
}
