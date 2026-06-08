/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGetDashboardStatsQuery } from "../../../redux/api/dashboardApi";
import {
	FolderKanban,
	CheckSquare,
	Clock,
	AlertCircle,
	TrendingUp,
	Users,
} from "lucide-react";
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	AreaChart,
	Area,
} from "recharts";
import KPICard from "@/components/dashboard/KPICard";
import DeadlinesPanel from "@/components/dashboard/DeadlinesPanel";
import ActivityLog from "@/components/dashboard/ActivityLog";
import styles from "./dashboard.module.css";

export default function Dashboard() {
	const {
		data,
		isLoading: loading,
		error,
		refetch,
	} = useGetDashboardStatsQuery();

	if (loading) {
		return (
			<div className={styles.dashboardContainer}>
				{/* KPI Skeleton */}
				<div className={styles.kpiGrid}>
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className={`${styles.kpiCard} shimmer`}
							style={{ height: "98px" }}
						/>
					))}
				</div>

				{/* Main Content Skeleton */}
				<div className={styles.mainContent}>
					<div className={styles.chartsSection}>
						<div
							className={`${styles.chartCard} shimmer`}
							style={{ height: "350px" }}
						/>
						<div
							className={`${styles.chartCard} shimmer`}
							style={{ height: "350px" }}
						/>
						<div className={styles.chartsRow}>
							<div
								className={`${styles.chartCard} shimmer`}
								style={{ height: "300px" }}
							/>
							<div
								className={`${styles.chartCard} shimmer`}
								style={{ height: "300px" }}
							/>
						</div>
					</div>
					<div
						className={`${styles.sideCard} shimmer`}
						style={{ height: "400px" }}
					/>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div
				style={{
					padding: "2rem",
					textAlign: "center",
					color: "var(--danger)",
				}}
			>
				<p>An error occurred while loading dashboard statistics.</p>
				<button
					onClick={() => refetch()}
					style={{
						marginTop: "1rem",
						padding: "0.5rem 1rem",
						backgroundColor: "var(--primary)",
						color: "#ffffff",
						borderRadius: "var(--radius-sm)",
					}}
				>
					Retry
				</button>
			</div>
		);
	}

	const {
		kpis,
		projectProgressList,
		priorityChartData,
		statusChartData,
		workloadSummary,
		recentActivities,
		upcomingDeadlines,
	} = data;

	// Chart Custom Styling
	const PIE_COLORS = ["#fbbf24", "#38bdf8", "#34d399"]; // Todo (Amber), In Progress (Light Blue), Completed (Emerald)
	const PRIORITY_COLORS = {
		High: "#f87171", // Red
		Medium: "#fbbf24", // Amber
		Low: "#60a5fa", // Blue
	};

	const formattedPriorityData = priorityChartData.map((item: any) => ({
		...item,
		fill:
			PRIORITY_COLORS[item.name as keyof typeof PRIORITY_COLORS] ||
			"var(--primary)",
	}));

	return (
		<div className={styles.dashboardContainer}>
			{/* KPI Cards Grid */}
			<div className={styles.kpiGrid}>
				<KPICard
					icon={<FolderKanban size={24} />}
					value={kpis.totalProjects}
					label="Total Projects"
					iconBg="var(--primary-light)"
					iconColor="var(--primary)"
				/>

				<KPICard
					icon={<CheckSquare size={24} />}
					value={kpis.totalTasks}
					label="Total Tasks"
					iconBg="var(--bg-tertiary)"
					iconColor="var(--text-secondary)"
				/>

				<KPICard
					icon={<CheckSquare size={24} />}
					value={kpis.completedTasks}
					label="Completed Tasks"
					iconBg="var(--success-light)"
					iconColor="var(--success)"
				/>

				<KPICard
					icon={<AlertCircle size={24} />}
					value={kpis.pendingTasks}
					label="Pending Tasks"
					iconBg="var(--warning-light)"
					iconColor="var(--warning)"
				/>

				<KPICard
					icon={<Clock size={24} />}
					value={kpis.overdueTasks}
					label="Overdue Tasks"
					iconBg="var(--danger-light)"
					iconColor="var(--danger)"
				/>
			</div>

			{/* Main Sections */}
			<div className={styles.mainContent}>
				{/* Left Side: Charts & Trends */}
				<div className={styles.chartsSection}>
					{/* Project Progress Trends */}
					<div className={styles.chartCard}>
						<div className={styles.chartHeader}>
							<h3 className={styles.chartTitle}>
								Project Progress Trend
							</h3>
							<TrendingUp
								size={18}
								style={{ color: "var(--text-tertiary)" }}
							/>
						</div>
						<div className={styles.chartBody}>
							{projectProgressList.length === 0 ? (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: "100%",
										color: "var(--text-tertiary)",
									}}
								>
									No active projects found.
								</div>
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={projectProgressList}
										margin={{
											top: 10,
											right: 10,
											left: -20,
											bottom: 0,
										}}
									>
										<defs>
											<linearGradient
												id="colorProgress"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="var(--primary)"
													stopOpacity={0.4}
												/>
												<stop
													offset="95%"
													stopColor="var(--primary)"
													stopOpacity={0.0}
												/>
											</linearGradient>
										</defs>
										<XAxis
											dataKey="name"
											tick={{
												fill: "var(--text-secondary)",
												fontSize: 11,
											}}
										/>
										<YAxis
											domain={[0, 100]}
											tick={{
												fill: "var(--text-secondary)",
												fontSize: 11,
											}}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor:
													"var(--bg-secondary)",
												borderColor:
													"var(--border-color)",
												color: "var(--text-primary)",
											}}
											formatter={(value) => [
												`${value}%`,
												"Progress",
											]}
										/>
										<Area
											type="monotone"
											dataKey="progress"
											stroke="var(--primary)"
											strokeWidth={2}
											fillOpacity={1}
											fill="url(#colorProgress)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>

					{/* Team Productivity Overview */}
					<div className={styles.chartCard}>
						<div className={styles.chartHeader}>
							<h3 className={styles.chartTitle}>
								Team Productivity Overview
							</h3>
							<Users
								size={18}
								style={{ color: "var(--text-tertiary)" }}
							/>
						</div>
						<div className={styles.chartBody}>
							{!workloadSummary ||
							workloadSummary.length === 0 ? (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: "100%",
										color: "var(--text-tertiary)",
									}}
								>
									No team member data found.
								</div>
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={workloadSummary}
										margin={{
											top: 10,
											right: 10,
											left: -20,
											bottom: 0,
										}}
									>
										<XAxis
											dataKey="name"
											tick={{
												fill: "var(--text-secondary)",
												fontSize: 11,
											}}
										/>
										<YAxis
											allowDecimals={false}
											tick={{
												fill: "var(--text-secondary)",
												fontSize: 11,
											}}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor:
													"var(--bg-secondary)",
												borderColor:
													"var(--border-color)",
												color: "var(--text-primary)",
											}}
										/>
										<Legend
											verticalAlign="top"
											height={36}
										/>
										<Bar
											dataKey="completedTasks"
											name="Completed Tasks"
											stackId="a"
											fill="var(--success)"
											radius={[0, 0, 0, 0]}
										/>
										<Bar
											dataKey="pendingTasks"
											name="Pending Tasks"
											stackId="a"
											fill="var(--warning)"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>

					<div className={styles.chartsRow}>
						{/* Task Status distribution */}
						<div className={styles.chartCard}>
							<h3 className={styles.chartTitle}>
								Task Status Distribution
							</h3>
							<div className={styles.chartBody}>
								{kpis.totalTasks === 0 ? (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											height: "100%",
											color: "var(--text-tertiary)",
										}}
									>
										No tasks found.
									</div>
								) : (
									<ResponsiveContainer
										width="100%"
										height="100%"
									>
										<PieChart>
											<Pie
												data={statusChartData}
												cx="50%"
												cy="45%"
												innerRadius={60}
												outerRadius={80}
												paddingAngle={5}
												dataKey="value"
											>
												{statusChartData.map(
													(
														entry: any,
														index: number,
													) => (
														<Cell
															key={`cell-${index}`}
															fill={
																PIE_COLORS[
																	index %
																		PIE_COLORS.length
																]
															}
														/>
													),
												)}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor:
														"var(--bg-secondary)",
													borderColor:
														"var(--border-color)",
													color: "var(--text-primary)",
												}}
											/>
											<Legend
												verticalAlign="bottom"
												height={36}
											/>
										</PieChart>
									</ResponsiveContainer>
								)}
							</div>
						</div>

						{/* Task Priority Bar Chart */}
						<div className={styles.chartCard}>
							<h3 className={styles.chartTitle}>
								Tasks by Priority
							</h3>
							<div className={styles.chartBody}>
								{kpis.totalTasks === 0 ? (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											height: "100%",
											color: "var(--text-tertiary)",
										}}
									>
										No tasks found.
									</div>
								) : (
									<ResponsiveContainer
										width="100%"
										height="100%"
									>
										<BarChart
											data={formattedPriorityData}
											margin={{
												top: 10,
												right: 10,
												left: -20,
												bottom: 0,
											}}
										>
											<XAxis
												dataKey="name"
												tick={{
													fill: "var(--text-secondary)",
													fontSize: 12,
												}}
											/>
											<YAxis
												allowDecimals={false}
												tick={{
													fill: "var(--text-secondary)",
													fontSize: 12,
												}}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor:
														"var(--bg-secondary)",
													borderColor:
														"var(--border-color)",
													color: "var(--text-primary)",
												}}
											/>
											<Bar
												dataKey="value"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right Side: Activity Log & Upcoming Deadlines */}
				<div className={styles.sideSection}>
					<DeadlinesPanel upcomingDeadlines={upcomingDeadlines} />
					<ActivityLog
						recentActivities={recentActivities}
						projects={projectProgressList}
					/>
				</div>
			</div>
		</div>
	);
}
