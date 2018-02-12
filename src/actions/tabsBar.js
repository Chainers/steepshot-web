export function setActiveIndex(point, index) {
  return {
    type: 'SET_ACTIVE_TAB_INDEX',
    point,
    index
  }
}

export function pageLoaded(point) {
  return {
    type: 'TAB_PAGE_LOADED',
    point
  }
}

export function pageLoading(point) {
  return {
    type: 'TAB_PAGE_LOADING',
    point
  }
}
