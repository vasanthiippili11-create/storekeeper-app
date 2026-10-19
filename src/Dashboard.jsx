import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { USD_TO_INR, formatINR } from "./currency.js";

function Dashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("/orders.json")
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
            })
            .catch((error) => {
                console.error("Error loading orders:", error);
            });
    }, []);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Total sales per month, in rupees
    const monthlyData = months.map((month) => {
        const total = orders
            .filter((order) => {
                if (!order.orderedAt) return false;
                return order.orderedAt.startsWith(month);
            })
            .reduce((sum, order) => {
                const amount = parseFloat(String(order.amount).replace(/[$,₹]/g, ""));
                return sum + (isNaN(amount) ? 0 : amount * USD_TO_INR);
            }, 0);

        return {
            month: month,
            amount: total,
        };
    });

    return (
        <div style={{ padding: "30px" }}>
            <h2>Dashboard</h2>

            <div style={{ width: "100%", height: "400px", marginTop: "30px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                        <Tooltip formatter={(value) => [formatINR(value), "Sales"]} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#ff6b1a"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Dashboard;