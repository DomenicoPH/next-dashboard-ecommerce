"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LandingPageForm from "@/app/dashboard/landing_create/LandingPageForm";
import { getLandingPages, updateLandingPage } from "@/app/lib/landingStore";
import { getCategorias, Categoria } from "@/app/lib/categoriaStore";
import { LandingPage } from "@/app/lib/landingStore";

export default function EditLandingPagePage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = Number(params?.id);
  const [landing, setLanding] = useState<LandingPage | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    (async () => {
      const [lps, cats] = await Promise.all([getLandingPages(), getCategorias()]);
      setCategorias(cats);
      const found = lps.find((x) => x.id === id) ?? null;
      setLanding(found);
    })();
  }, [id]);

  if (!landing) return <div>Cargando...</div>;

  const handleUpdate = async (lp: LandingPage) => {
    await updateLandingPage(lp);
  };

  return <LandingPageForm 
    initialData={landing} 
    categorias={categorias} 
    onSubmit={handleUpdate} 
    onSuccess={() => router.push("/dashboard/landing_create/landingpage")} 
  />;
}
