export interface DashboardData {
    system_overview: {
        active_trials: string;
        active_trial_growth: string;
        total_patients: string;
        total_patients_growth: string;
    };
    patient_pipeline: {
        identified_patients: string;
        identified_patients_percent: string;
        contacted_patients: string;
        contacted_patients_percent: string;
        screened_patients: string;
        screened_patients_percent: string;
        enrolled_patients: string;
        enrolled_patients_percent: string;
    };
    top_performers: Array<{
        site_name: string;
        site_id: string;
        enrolled_patients: number;
        performance_change: string;
    }>;
    matched_trials: Array<{
        trial_id: string;
        trial_name: string;
        matched_patients: number;
        status: string;
        match_score: string;
    }>;
    total_trials: number;
    total_patients_pipeline: number;
    enrollment_rate: string;
    trial_performance_summary: {
        contact_rate: string;
        screen_rate: string;
        enrollment_rate: string;
    };
    practices: {
        total_providers: string;
        provider_count_trend: Array<{
            month: string,
            provider_count: string
        }>;
        readiness_score_trend: Array<{
            month: string,
            readiness_score: string
        }>;
    }
    qualification_levels: {
        "90-100": string;
        "80-89": string;
        "70-79": string;
        "69 and below": string;
    },
    patient_status_overview: {
        "identified_patients": string;
        "identified_patients_percent": string;
        "contacted_patients": string;
        "contacted_patients_percent": string;
        "screened_patients": string;
        "screened_patients_percent": string;
        "enrolled_patients": string;
        "enrolled_patients_percent": string;
    },
    trials: {
        "total_trials": string;
        "high_qualification_trials": string;
        "total_patients": string;
        "enrollment_rate": string;
    },

}
