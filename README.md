# Messenger_Pay

## [109-1] Web Programming Final
#### 專題題目名稱：(Group 75) Messenger Pay
#### Deploy 連結：https://messenger-pay.herokuapp.com/
#### Demo影片：https://youtu.be/lmtkzo79Pfs
#### 動機：
平常跟朋友吃飯或是出去玩很容易找朋友代墊或是統一先付，但又沒有一個好的方式記錄，常常就忘記還錢或是忘記對方到底還我了沒(常常用messenger暱稱來記錄，故得名，但還是很容易忘記)。於是就決定做一個可以簡單記錄並查看的web來記錄。一開始是想說可以連FB account，就可以直接用好友來記錄彼此的債務關係，但後來去查發現朋友的權限需要給FB送審後才能拿到，所以就暫時先用自己的DB來記錄使用者資訊，以後有機會再串FB的graph api好了。
#### 描述這個服務在做什麼：
簡易的記帳/分帳網頁，使用者可以創建帳號，與好友記錄彼此的債務關係；也可以創建新的群組來記錄，在出去玩，或是在固定的交友圈時會很方便。除此之外，還可以用圓餅圖看誰到底最常欠錢不還，以及最多欠過多少錢。
#### 使用/操作方式：
使用者須先註冊帳號，帳號不得與他人重複(會提醒)。登入後有用jwt記錄登入狀態，一天之內便不用再登入。登入後可以新增與其他人的債務關係，或是建立群組來新增多人的債務關係。我們加了蠻多user -friendly的提示，例如在載入或是送http request的時候會有loading，成功後會有snackbar跳出等等。並且我們也有盡量考慮到RWD的設計，所以在手機上使用也是可以的！至於其他細節功能便不贅述，整體使用上直觀明瞭，大家可以上去玩玩看！
#### GITHUB LINK：隱私問題不方便公開
#### 使用與參考之框架/模組/原始碼：
**Frontend：** react, axios, material-ui, dayjs, javascript-time-ago, seedrandom, bootstrap, react-minimal-pie-chart

**Backend：** express, body-parser, cookie-parser, cors, dotenv-defaults, jsonwebtoken

**DB：** mongoDB& mongoose
#### 心得：
陳俊廷

我主要負責的是後端以及些許的前端。後端的部分，在設計DB schema的時候花蠻多時間的，因為記錄債務關係的時候還要考到群組內部的問題，因此原本用的第一個版本寫到後來後來覺得太複雜了，所以又設計了第二個簡易的版本。比較有趣的大概是jwt的部分，因為之前沒有用過，後來查了很久的資料才成功讓client不用一直登入。前端的部分我很喜歡找一些套件來用，例如圓餅圖還有顯示距離目前的時間等，這些比較功能性也比較新奇的部分是我覺得比較有成就感的。最後，我覺得整個project最難的部分還是UI/UX，畢竟要在完全沒有UI/UX經驗的情況下自己設計，寫出一個好用的WEB還蠻難的QQ。

高偉堯

這次的期末專案我主要負責前端版面的設計以及部分功能的實作。比起作業注重的語法熟悉以及功能實作，期末專案還需要額外考慮版面設計、操作流程等，雖然感覺講起來很簡單，但因為很瑣碎，實作起來其實蠻花時間以及心思的，但也讓我對前端設計有非常深入的體會。至於後端的部分，雖然不在我主要負責的工作範圍內，但是大神組員還是很有耐心地詳細講解許多串接的方法還有程式架構，甚至介紹了許多進階的debug技巧，使我更快熟悉並理解整個專案，真的非常感謝。

#### 分工
##### 陳俊廷
* Deploy
* 後端全部
* 前端：
  * 程式架構(包含react router)
  * jwt token
  * Header
  * About page
  * Account page
  * Login/Register page
  * Context
  * 圓餅圖
  * time from now
  * axois default setting


高偉堯
* 前端：
  * UI/UX：在哪裡顯示啥，使用流程
  * Home Page：新增交易、統計
  * Friend Page：回首頁、新增交易、排序、編輯以及一鍵還錢
  * Group Page：群組成員、回首頁、新增交易、排序、Fliter、編輯以及一鍵還錢
