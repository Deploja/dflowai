
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns";

interface RevenueData {
  id: string;
  amount: number;
  revenue_date: string;
  description: string;
  contract: {
    id: string;
    client_name: string;
    project_name: string;
    contract_value: number;
  };
  consultant: {
    first_name: string;
    surname: string;
  };
}

export function RevenueOverview() {
  const [timePeriod, setTimePeriod] = useState("30");

  const getDateRange = () => {
    const now = new Date();
    const endDate = endOfDay(now);
    let startDate: Date;

    switch (timePeriod) {
      case "7":
        startDate = startOfDay(subDays(now, 7));
        break;
      case "30":
        startDate = startOfDay(subDays(now, 30));
        break;
      case "90":
        startDate = startOfDay(subDays(now, 90));
        break;
      case "365":
        startDate = startOfDay(subYears(now, 1));
        break;
      case "all":
        startDate = new Date("2000-01-01");
        break;
      default:
        startDate = startOfDay(subDays(now, 30));
    }

    return { startDate, endDate };
  };

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue", timePeriod],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      console.log("Fetching revenue data for period:", timePeriod, "from", startDate, "to", endDate);
      
      const { data, error } = await supabase
        .from("revenue")
        .select(`
          id,
          amount,
          revenue_date,
          description,
          contract:contracts(
            id,
            client_name,
            project_name,
            contract_value
          ),
          consultant:consultants(
            first_name,
            surname
          )
        `)
        .gte("revenue_date", startDate.toISOString().split('T')[0])
        .lte("revenue_date", endDate.toISOString().split('T')[0])
        .order("revenue_date", { ascending: false });

      if (error) {
        console.error("Error fetching revenue data:", error);
        throw error;
      }

      console.log("Fetched revenue data:", data);
      return data as RevenueData[];
    },
  });

  const totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Period Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Track revenue from contracts over time</p>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <DollarSign className="h-5 w-5" />
            <span>Total Revenue - {
              timePeriod === "7" ? "7 days" :
              timePeriod === "30" ? "30 days" :
              timePeriod === "90" ? "90 days" :
              timePeriod === "365" ? "1 year" :
              "all time"
            }</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            {revenueData?.length || 0} transactions
          </p>
        </CardContent>
      </Card>

      {/* Revenue Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Details</span>
          </CardTitle>
          <CardDescription>
            Detailed overview of all revenue and which contracts generated them
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          ) : !revenueData || revenueData.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No revenue found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There is no registered revenue for the selected time period.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Consultant</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((revenue) => (
                    <TableRow key={revenue.id}>
                      <TableCell>
                        {format(new Date(revenue.revenue_date), 'yyyy-MM-dd')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {revenue.consultant.first_name} {revenue.consultant.surname}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {revenue.contract.client_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={revenue.contract.project_name}>
                          {revenue.contract.project_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(Number(revenue.amount))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate text-gray-600 dark:text-gray-400" title={revenue.description || ''}>
                          {revenue.description || '-'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
