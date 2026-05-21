package com.taskflow.api.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AnalyticsService {

    public Map<String, Object> getUserProductivityInsights(Long userId) {
        Map<String, Object> insights = new HashMap<>();

        // Generate synthetic hourly activity volume averages for Recharts
        List<Map<String, Object>> hourlyActivity = new ArrayList<>();
        int[] hours = {9, 10, 11, 12, 13, 14, 15, 16, 17, 18};
        int[] scores = {65, 94, 88, 45, 30, 75, 82, 90, 60, 40}; // High peak in morning, slump at lunch, secondary peak afternoon
        for (int i = 0; i < hours.length; i++) {
            Map<String, Object> hourData = new HashMap<>();
            hourData.put("hour", String.format("%02d:00", hours[i]));
            hourData.put("efficiency", scores[i]);
            hourlyActivity.add(hourData);
        }

        // Weekly task completion metrics
        List<Map<String, Object>> weeklyStats = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        int[] completed = {4, 7, 5, 8, 6, 2, 1};
        int[] points = {8, 15, 10, 18, 12, 4, 2};
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", days[i]);
            dayData.put("completed", completed[i]);
            dayData.put("points", points[i]);
            weeklyStats.add(dayData);
        }

        insights.put("focusScore", 88);
        insights.put("peakHour", "10:00 AM");
        insights.put("averageVelocity", 2.3); // story points per day
        insights.put("completedThisWeek", 33);
        insights.put("hourlyActivity", hourlyActivity);
        insights.put("weeklyCompletion", weeklyStats);

        return insights;
    }
}
