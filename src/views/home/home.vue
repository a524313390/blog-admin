<template>
  <div class="container">
    <div class="top">
      <el-row :gutter="20">
        <el-col
          :span="6"
          v-for="(item, index) in totals"
          :key="item.name + index"
        >
          <div class="article">
            <el-row class="content" :gutter="20">
              <el-col :span="12">
                <div class="left">
                  <i class="el-icon-reading"></i>
                </div>
              </el-col>
              <el-col class="right" :span="12">
                <div>
                  <countTo
                    :startVal="0"
                    :endVal="item.count"
                    :duration="1000"
                  ></countTo>
                  <p>{{ item.name }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div class="echarts">
        <div class="echarts-top">
          <div id="myChart" ref="myChart"></div>
          <div id="myCharts" ref="myCharts"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import countTo from "vue-count-to";
import { apiUrl } from "../../api";
import echarts from "echarts";
@Component({
  name: "home",
  components: {
    countTo
  }
})
export default class Home extends Vue {
  private totals: Array<any> = [];
  private lineTitle: Array<string> = [];
  private lineCount: Array<number> = [];
  private tagsTitle: Array<string> = [];
  private tagsData: Array<any> = [];
  private lineOptions: any = {
    color: ["#3398DB"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: ["文章", "标签", "留言", "用户"],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: "60%",
        data: [10, 52, 200, 334]
      }
    ]
  };
  private tgsOptions: any = {
    title: {
      text: "标签统计",

      x: "center"
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["前端", "后台", "vue", "Node"]
    },
    series: [
      {
        name: "统计条数",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [
          { value: 335, name: "前端" },
          { value: 310, name: "后台" },
          { value: 234, name: "vue" },
          { value: 135, name: "Node" }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };
  private async getTotal() {
    (this as any).$axios(`${apiUrl.total}`).then((res: any) => {
      this.totals = res.data.message;
      this.totals.forEach((item: any) => {
        this.lineTitle.push(item.name);
        this.lineCount.push(item.count);
      });
      this.lineOptions.xAxis[0].data = this.lineTitle;
      (this.lineOptions.series[0] as any).data = this.lineCount;
    });
  }

  //获取饼图数据
  private async getToatlTgas() {
    const tags = await (this as any).$axios(`${apiUrl.totalTags}`);
    console.log(tags);
    let tagsArr = tags.data.message;
    if (tags.data.code == 0) {
      tagsArr.forEach((item: any) => {
        this.tagsTitle.push(item.tag_name);
        this.tagsData.push({
          value: item.count,
          name: item.tag_name
        });
      });
      this.tgsOptions.legend.data = this.tagsTitle;
      this.tgsOptions.series[0].data = this.tagsData;
    }
  }
  @Watch("tgsOptions", { deep: true })
  tgsEacharts(newVal, oldVal) {
    let chartRef: any = this.$refs.myChart;

    var myChart = echarts.init(chartRef);
    console.log(newVal);
    // 绘制条形图
    myChart.setOption(newVal);
  }
  private draw() {
    // 实例化echarts对象
    let chartRef: any = this.$refs.myChart;

    var myChart = echarts.init(chartRef);

    // 绘制条形图
    myChart.setOption(this.tgsOptions);
  }
  @Watch("lineOptions", { deep: true })
  lineEcharts(newVal, oldVal) {
    let chartRef: any = this.$refs.myCharts;
    var myCharts = echarts.init(chartRef);

    myCharts.setOption(newVal);
  }
  private total() {
    // 实例化echarts对象
    let chartRef: any = this.$refs.myCharts;

    var myCharts = echarts.init(chartRef);

    myCharts.setOption(this.lineOptions);
  }
  created() {
    this.getTotal();
    this.getToatlTgas();
  }
  mounted() {
    this.draw();
    this.total();
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.left {
  background: #409eff;
  height: 110px;
  color: #fff;
  text-align: center;
  line-height: 110px;
  i {
    font-size: 30px;
  }
}
.content {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.right {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 110px;
  background: #fff;
  span {
    font-size: 30px;
  }
}
.echarts-top {
  display: flex;
}
.echarts {
  width: 100%;
  margin-top: 50px;
  background: #fff;
  padding: 50px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#myChart {
  width: 50%;
  height: 500px;

  border: 1px solid #ccc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#myCharts {
  width: 50%;
  height: 500px;

  border: 1px solid #ccc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
