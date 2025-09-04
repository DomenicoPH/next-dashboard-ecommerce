"use client";

import SectionHeaderSkeleton from "./SectionHeaderSkeleton";
import CustomersTableSkeleton from "./CustomersTableSkeleton";

export default function AdminCustomersSkeleton() {
  return (
    <div className="p-6 w-full">
      <SectionHeaderSkeleton />

      <CustomersTableSkeleton rows={10} />
    </div>
  );
}
