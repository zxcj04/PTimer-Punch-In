# 工讀生打卡系統

## 簡介

![系統畫面](https://i.imgur.com/dzABe15.png)

這是一個工讀生打卡系統，使用者可以透過網頁進行打卡，並且可以查看打卡紀錄。
並且可以透過管理員帳號進行管理，例如新增、刪除、修改工讀生資料。

由於使用者可能使用不同裝置進行打卡，因此這個系統是一個網頁應用程式，可以在不同裝置上使用。
並且有全 RWD 設計，可以在不同螢幕大小的裝置上使用。

功能簡介：
- 打卡上班及下班
- 查詢自己打卡紀錄
- 修改最近一筆打卡紀錄
- (管理員) 查詢所有工讀生打卡紀錄
- (管理員) 新增及修改打卡紀錄
- (管理員) 管理工讀生可打卡專案
- (管理員) 匯出搜尋時間內打卡時間總和報表

This is a part-timer punch-in system, where users can clock in through a webpage and view their clock-in records. Additionally, it can be managed through an administrator account, for example, adding, deleting, or modifying part-timer information.

Since users may punch in using different devices, this system is a web application that can be used on various devices. It also features a full RWD (Responsive Web Design), making it usable on devices with different screen sizes.

Feature overview:
- Punch in and out
- Query own punch-in records
- Modify the most recent punch-in record
- (Administrator) Query all part-timer punch-in records
- (Administrator) Add and modify punch-in records
- (Administrator) Manage part-timer punch-in projects
- (Administrator) Export the total punch-in time report within the search time

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project setup

```bash
npm install
```

Edit `.env.development` and `.env.production` to set up the environment variables for API endpoints.
Or you can use `.env.development.local` and `.env.production.local` to override the environment variables.

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm run build
```
