"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store";
import { API } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";

export default function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const { setModels, setIsLoadingModels, setModelsError } = useChatStore.getState();
      setIsLoadingModels(true);
      try {
        const data = await API.listModels();
        const models = (data.models || []).map((m: any) => ({
          id: m.id,
          name: m.id.split(":").pop() || m.id,
        }));
        setModels(models);
      } catch (err) {
        setModelsError(String(err));
      } finally {
        setIsLoadingModels(false);
        setModelsLoaded(true);
      }
    };
    loadModels();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ChatArea />
      </div>
    </div>
  );
}
