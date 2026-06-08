'use client';

import React, { useState } from 'react';
import { useGetDashboardStatsQuery } from '../../../redux/api/dashboardApi';
import TeamToolbar from "@/components/team/TeamToolbar";
import TeamGrid, { MemberWorkload } from "@/components/team/TeamGrid";
import styles from './team.module.css';

export default function TeamWorkload() {
  const { data, isLoading: loading, error } = useGetDashboardStatsQuery();
  const workloads = data?.workloadSummary || [];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = workloads.filter((member: MemberWorkload) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.intro}>
          Monitor task allocation and productivity metrics across all system collaborators.
        </p>
      </div>

      <TeamToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <TeamGrid
        filteredWorkloads={filteredWorkloads}
        loading={loading}
        error={error}
      />
    </div>
  );
}

