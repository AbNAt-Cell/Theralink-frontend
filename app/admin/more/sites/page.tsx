"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getColumns, Site } from "./table-columns";
import { DataTable } from "@/components/ui/data-table";
import SiteModal, { SiteFormData } from "./SiteModal";

const initialSites: Site[] = [
  {
    id: "1",
    site: "Auspicious Community Service",
    address: "H0034 Med Management:95",
    phone: "(832) 774-7144",
    clients: 10,
  },
];

const SitesPage: React.FC = () => {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSite, setEditSite] = useState<SiteFormData | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleAdd = () => {
    setEditSite(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const site = sites.find(s => s.id === id);
    if (site) {
      setEditSite(site);
      setIsEdit(true);
      setModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSites(prev => prev.filter(site => site.id !== id));
  };

  const handleModalSubmit = (data: SiteFormData) => {
    if (isEdit && data.id) {
      setSites(prev => prev.map(site => site.id === data.id ? { ...site, ...data } : site));
    } else {
      setSites(prev => [
        ...prev,
        { ...data, id: Date.now().toString(), clients: 0 },
      ]);
    }
    setModalOpen(false);
    setEditSite(null);
    setIsEdit(false);
  };

  const filteredSites = sites.filter(site =>
    site.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sites</h2>
        <Button variant="secondary" onClick={handleAdd}>Add New Site</Button>
      </div>
      <div className="flex items-center gap-6 mb-6">
        <Input
          className="max-w-xs"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Switch checked={showInactive} onCheckedChange={setShowInactive} />
          <span>Show Inactive Site</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-center rounded-2xl overflow-hidden">
        <DataTable columns={getColumns(handleEdit, handleDelete)} data={filteredSites} />
      </div>
      <SiteModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditSite(null); setIsEdit(false); }}
        onSubmit={handleModalSubmit}
        initialData={editSite || undefined}
        isEdit={isEdit}
      />
    </div>
  );
};

export default SitesPage;
