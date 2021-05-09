<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-form label-width="80px" :model="formdata">
          <el-form-item label="选择日期">
            <el-date-picker
              v-model="formdata.date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :editable="false"
              style="width: 100%;"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="选择时段">
            <el-radio-group v-model="formdata.am_pm">
              <el-radio label="上午" value="1" />
              <el-radio label="下午" value="2" />
            </el-radio-group>
          </el-form-item>
          <el-divider />
          <el-form-item label="放号时间">
            <el-col :span="11">
              <el-date-picker v-model="formdata.begindate" type="date" placeholder="日期" :editable="false" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker v-model="formdata.begintime" placeholder="时间" :editable="false" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="放号数量">
            <el-input v-model="formdata.total" placeholder="输入放号数量" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { fetchList } from '@/api/order'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      today: parseTime(new Date(new Date().toLocaleDateString()).getTime(), '{y}-{m}-{d}'),
      tomorrow: parseTime(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000, '{y}-{m}-{d}'),
      pickerOptions: {
        disabledDate(val) {
          return new Date(val).getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      },
      formdata: {
        date: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
        am_pm: '',
        begindate: '',
        begintime: '',
        total: ''
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style>
.box-card {
  width: 500px;
  margin: 0 auto;
}
.line {
  text-align: center;
}
</style>
