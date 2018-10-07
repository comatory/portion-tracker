export default class ActivityActions {
  setUserActivities(userActivities) {
    return userActivities
  }

  setUserActivitiesPortions(userActivitiesPortions, filterId) {
    return { userActivitiesPortions, filterId }
  }

  removeActivityPortion(portionIds) {
    return { portionIds }
  }
}
