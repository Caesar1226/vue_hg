<template>
    <transition name="fade-transform" mode="out-in">
        <el-tabs type="border-card" @tab-click="changeTab">
            <div :style="{'height': '50px', 'margin-left': '10px'}">
                <search class="right-menu-item"/>
                <div class="press_btn">
                    <el-button type="text" :disabled="preBtn" @click="lastPage">上一页</el-button>
                    <el-button type="text" :disabled="nextBtn" @click="nextPage">下一页</el-button>
                </div>
            </div>
            <el-tab-pane :key="type.id" :label="type.title" v-for="type in Imagestypes">
                <ul class="selectImg">
                    <li :key="img.id" v-for="img in imgData">
                        <el-card :body-style="{ padding: '8px',  cursor:'pointer' }" shadow="hover">
                            <img :id="img.id" :src="imagesBaseUrl + img.picPath" @click="showAttr(img)"/>
                        </el-card>
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
    </transition>
</template>

<script>
import Search from '../HeaderSearch'
export default {
    components: {
        Search
    },
    data(){
        return {
            imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
            Imagestypes: [
                {
                    id: "0",
                    title: "所有"
                },
                {
                    id: "1",
                    title: "首页"
                },
                {
                    id: "2",
                    title: "分类"
                },
                {
                    id: "3",
                    title: "详情"
                },
                {
                    id: "4",
                    title: "活动"
                },
                {
                    id: "5",
                    title: "专题"
                },
                {
                    id: "6",
                    title: "其他"
                }
            ],
            levelId: "",
            currentPage: 1,
            searchValue: "",
            imgData: [],               // 图片数据
            preBtn: true,              // 判断上一页
            nextBtn: false,            // 判断下一页
        }
    },
    created(){
        this.getImages();
    },
    methods: {
        getImages() {
            let formateData = {
                levelId: this.levelId,
                pageNum: this.currentPage,
                pageSize: 12,
                picCname: this.searchValue,
                temp: 0
            };
            if (this.levelId == 0) {
                delete formateData.levelId;
            }
            this.$store.dispatch("axios_get_pic_resouce", formateData).then(res => {
                this.imgData = res.data.data.records;
            }).catch(err => {

            }); 
        },
        changeTab(tab, event){
            this.preBtn = true;
            this.currentPage = 1;
            this.levelId = tab.index;
            this.getImages();
        },
        lastPage() {
            if (this.currentPage == 1) {
                this.preBtn = true;
            } else {
                this.currentPage--;
                this.preBtn = false;
            }
            this.getImages();
        },
        nextPage() {
            this.currentPage++;
            if (this.currentPage == 1) {
                this.preBtn = true;
            } else {
                this.preBtn = false;
            }
            this.getImages();
        },
        showAttr(item){
            item["domainUrl"] = this.imagesBaseUrl;
            this.$emit('getSelectImage', item)
        }
    },    
}
</script>

<style scoped lang="scss">
.selectImg {
    width: 100%;
    height: 400px;
    white-space: nowrap;
    & li {
        list-style-type: none;
        float: left;
        margin-left: 10px;
        margin-top: 10px;
        & img {
            width: 128px;
            height: 72px;
        }
    }
}
.right-menu-item {
    float: left;
    width: 250px;
}
.press_btn {
    display: flex;
    height: 50px;
    float: right;
}
</style>