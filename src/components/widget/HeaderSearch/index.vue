<template>
    <div :class="{'show': show}" class="header-search">
        <el-input
            v-model="search"
            placeholder="搜索图片"
            class="header-search-select"
        ></el-input>
        <el-button
            circle 
            icon="el-icon-search"
            size="mini"
            @click="click"
        ></el-button>
    </div>
</template>

<script>
export default {
    data(){
        return {
            search: '',
            show: false,
        }
    },
    methods: {
        click: function(){
            this.show = !this.show
        }
    }
}
</script>

<style scoped lang="scss">
.header-search {
    font-size: 0 !important;
    .header-search-select {
        width: 0;
        border-radius: 0;
        background: transparent;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        transition: width 0.2s;
        /deep/ .el-input__inner {
            border-radius: 0;
            border: 0;
            padding-left: 0;
            padding-right: 0;
            border-bottom: 1px solid #d9d9d9;
            // vertical-align: middle;
        }
    }
     &.show {
        .header-search-select {
            width: 210px;
            margin-left: 10px;
        }
    }
}
</style>