"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import Image from "next/image"

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Sidebar } from "@/components/sidebar"
import { columns } from "@/components/table/columns"

import { supabase } from "@/components/initSupabase"
import DataTable from "@/components/table/DataTable"

export default function DashboardPage() {

  const [data, setData] = useState([])

  useEffect(() => {
    getArticles()
  }, [])

  async function getArticles() {
    // fetch analyzed_news from supabase
    const { data, error } = await supabase
      .from("analyzed_news")
      .select("*")
      .order("datetime", { ascending: false })
      .limit(75)
  
    if (error) console.log("error", error)

    if (data) setData(data as never[])
  }

  return (
    <div className="grid lg:grid-cols-6 h-screen">
        <Sidebar/>
        <div className="col-span-3 lg:col-span-5 lg:border-l">
          <div className="flex items-center justify-between space-y-2 px-4 py-6">
            <h2 className="text-3xl font-bold tracking-tight">Analyzed Articles</h2>
          </div>
          
          <DataTable
            columns={columns}
            data={data}
          />
        </div>
    </div>
  )
}