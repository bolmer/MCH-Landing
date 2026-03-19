"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FreshnessIndicator from "../FreshnessIndicator";

const navigation = [
  { name: "Resumen", href: "/dashboard", icon: "dashboard" },
  { name: "Linaje", href: "/dashboard/lineage", icon: "hub" },
  { name: "Gobernanza", href: "/dashboard/governance", icon: "verified_user" },
  { name: "Rendimiento", href: "/dashboard/performance", icon: "monitoring" },
  { name: "Alertas", href: "/dashboard/alerts", icon: "notifications", count: 2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] shrink-0">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center px-2 py-2">
            <div className="bg-primary/20 aspect-square rounded-full size-10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                NiFi Ops
              </h1>
              <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal leading-normal">
                Governance Dashboard
              </p>
            </div>
          </div>

          <FreshnessIndicator />

          <div className="flex flex-col gap-2 mt-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-primary/10 dark:bg-[#232f48] border border-primary/20 dark:border-transparent text-primary dark:text-white"
                      : "hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-600 dark:text-[#92a4c9]"
                    }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "text-primary dark:text-white" : ""
                      }`}
                  >
                    {item.icon}
                  </span>
                  <p
                    className={`text-sm font-medium leading-normal ${isActive ? "text-primary dark:text-white" : ""
                      }`}
                  >
                    {item.name}
                  </p>
                  {item.count && (
                    <span className="ml-auto bg-status-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
          <div
            className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEolXcjCX6l9XDm0OvPuHkf-hSvIFE4FixYjklzyqC9e2R6n6VD1c9D28ZhpZLhin69VzRF-eIfBptoW2uA96dtJt9DAXz9kv-upEpUcl8tpILma67uZ_f-ZSCB9D3b-acoa5yowXC3DSu7T1NbFXUS4iElrj5NISk5myKPwK1Y_tGpFQWyr6fX5gx6U-02Bxl9UbjfIf363YaOlPJwYABANYUaOd7fSrPZdcDqGM7vjAfWe-586IHg74ztUFsMa4wE_maxsMWFaHm")',
            }}
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium dark:text-white">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">UC CHRISTUS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
