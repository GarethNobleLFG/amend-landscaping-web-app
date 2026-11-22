package utils

import "time"

func CalculateDaysSinceLastJob(lastScheduledDay *time.Time, now time.Time) *int {
	if lastScheduledDay == nil {
		return nil
	}

	loc := now.Location()
	nowMidnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	sched := lastScheduledDay.In(loc)
	schedMidnight := time.Date(sched.Year(), sched.Month(), sched.Day(), 0, 0, 0, 0, loc)

	// Future scheduled job resolves to nil
	if schedMidnight.After(nowMidnight) {
		return nil
	}

	days := int(nowMidnight.Sub(schedMidnight).Hours() / 24)
	if days < 0 {
		days = 0
	}
	return &days
}
