"use client";

import React, { Suspense } from "react";
import { Box } from "@mui/material";
import GlobalCard from "../../../components/common/GlobalCard";
import OrganisationCard from "../../../components/common/OrganisationCard";
import { Building2, Globe } from "lucide-react";

const SettingPage = () => {
  const [activeSystemTab, setActiveSystemTab] = React.useState("global");

  return (
    <>
        <Box className="p-6 flex gap-6 justify-center">
          <div className="w-80 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              System Settings
            </h2>

            <Box
              onClick={() => setActiveSystemTab("global")}
              className={`cursor-pointer px-4 py-2 rounded-md flex items-center gap-2  ${
                activeSystemTab === "global"
                  ? "bg-[#FEF4ED] text-[#F06D1A] font-semibold"
                  : "text-gray-500"
              }`}
            >
              <Globe className="w-5 h-5 mr-2" /> Global Settings
            </Box>

            <Box
              onClick={() => setActiveSystemTab("organisation")}
              className={`cursor-pointer mt-4 px-4 py-2 rounded-md flex items-center gap-2  ${
                activeSystemTab === "organisation"
                  ? "bg-[#FEF4ED] text-[#F06D1A] font-semibold"
                  : "text-gray-500"
              }`}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Organisation Settings
            </Box>
          </div>

          <div className="flex-1">
            {activeSystemTab === "global" && <GlobalCard />}
            {activeSystemTab === "organisation" && <OrganisationCard />}
          </div>
        </Box>
    </>
  );
};

const SuspendedSettingPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SettingPage />
  </Suspense>
);

export default SuspendedSettingPage;
