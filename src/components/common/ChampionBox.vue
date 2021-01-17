<template>
<div tabindex="0" class="tag_container" >
    <el-tag v-for="tag in time" :key="tag" 
    @close='removeChampionTime(tag)' closable>{{tag}}</el-tag>
    <el-input
    class="input-new-tag"
    v-if="tagVisible"
    v-model="tagValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="addChampionTime"
    @blur="addChampionTime">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ 获奖年份</el-button>
</div>
</template>

<script>
export default {
    props : {
        time:Array,
    },
    data() {
        return {
            tagVisible : false,
            tagValue : "",
        }
    },
    methods: {
        showTagInput(){
            this.tagVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        addChampionTime() {
            if(this.time.includes(this.tagValue)){
                this.$message.warning("获奖年份不能重复!!!");
                return;
            }
            let tagValue = this.tagValue;
            if (tagValue) {
                this.time.push(tagValue);
            }
            this.tagVisible = false;
            this.tagValue = '';
        },
        removeChampionTime(tag){
            this.time.splice(this.time.indexOf(tag), 1);
        }
    },
}
</script>

<style scoped>
  .tag_container {
    width:240px;
    display:flex;
    flex-wrap:wrap;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding:2px
  }
  .tag_container:focus {
      border-color: #409EFF;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>