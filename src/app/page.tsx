"use client";

import Header from "@/components/pages/landing-page/Header";
import Afterheader from "@/components/pages/landing-page/Afterheader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [open, setOpen] = useState(false);
  const [maskedIp, setMaskedIp] = useState("");

  useEffect(() => {
    const alreadyShown = localStorage.getItem("ipPopupShown");

    if (!alreadyShown) {
      setOpen(true);

      localStorage.setItem("ipPopupShown", "true");
    }
    async function fetchIp() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = data?.ip;
        if (ip) {
          const parts = ip.split(".");
          if (parts.length === 4) {
            const safe = `${parts[0]}.${parts[1]}.${parts[2].slice(0, 1)}xx.xxx`;
            setMaskedIp(safe);
          }
        }
      } catch (e) {
        console.error("Failed to fetch IP");
      }
    }

    fetchIp();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Ellipsis className="w-10 h-10 text-white animate-spin" />
        </div>
      ) : (
        <div>
          <Header />
          <div className="p-4">
            <Afterheader />
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Notice</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2 leading-relaxed">
            We use your public IP
            {maskedIp && (
              <span className="font-semibold"> ({maskedIp})</span>
            )}
            {" "}
            only to identify your Internet provider for a personal data-science study.
            No sensitive or personal data is collected, stored, or shared.
          </p>

          <DialogFooter className="mt-6">
            <Button onClick={() => setOpen(false)} className="w-full">Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
