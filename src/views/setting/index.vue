<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="配置日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item> -->
    </el-form>

    <el-table id="export" v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row size="small">
      <el-table-column label="配置日期" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.day_num }}
        </template>
      </el-table-column>
      <el-table-column label="配置时段" align="center" width="100">
        <template slot-scope="scope">
          {{ parseInt(scope.row.am_pm) === 1? '上午' : '下午' }}
        </template>
      </el-table-column>
      <el-table-column label="放号总数" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.nums }}
        </template>
      </el-table-column>
      <el-table-column label="剩余号数" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.useful_nums }}
        </template>
      </el-table-column>
      <el-table-column label="放号时间" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.can_apply }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { fetchSettingList } from '@/api/order'

import Pagination from '@/components/Pagination'

export default {
  name: 'ExportExcel',
  components: { Pagination },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      filterForm: {
        date: ''
      },
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchSettingList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.date !== '') {
        this.listQuery.date = this.filterForm.date
      }
      this.fetchData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
