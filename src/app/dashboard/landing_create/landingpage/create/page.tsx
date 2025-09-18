"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LandingPageForm from "@/app/dashboard/landing_create/LandingPageForm";
import { addLandingPage } from "@/app/lib/landingStore";
import { getCategorias, Categoria } from "@/app/lib/categoriaStore";

export default function CreateLandingPagePage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    (async () => {
      const cats = await getCategorias();
      setCategorias(cats);
    })();
  }, []);

  const handleCreate = async (lp: any) => {
    await addLandingPage(lp);
    router.push("/dashboard/landing_create/landingpage");
  };

  return <LandingPageForm categorias={categorias} onSubmit={handleCreate} />;
}
