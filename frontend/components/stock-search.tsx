"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StockSearch() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim();

    if (!/^\d{6}$/.test(normalized)) {
      setError("请输入 6 位 A 股股票代码");
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);
    router.push(`/analysis/${normalized}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          inputMode="numeric"
          maxLength={6}
          placeholder="例如 600519"
          value={code}
          disabled={isLoading}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, ""));
            setError("");
          }}
          aria-label="A 股股票代码"
        />
        <Button type="submit" className="sm:w-36" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          ) : (
            <Search size={18} aria-hidden="true" />
          )}
          {isLoading ? "分析中" : "分析"}
        </Button>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-400" aria-live="polite">正在获取行情并生成分析...</p> : null}
    </form>
  );
}
