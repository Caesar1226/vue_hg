export default {
    add_cached_view: (state, view) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
    },
    recommendList_setter (state, value) {
        state.recommendList.push(value)
    },
    recommendList_update (state, value) {
        state.recommendList.splice(value.index,1);
        state.recommendList.push(value)
    }
}