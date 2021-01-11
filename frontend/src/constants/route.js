import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import Home from '../component/Home'
import Friend from '../component/Friend'
import Setting from '../component/Setting'
import About from '../component/About'
import Template from '../component/template'

export default {
  route: [
    // 首頁
    { path: '/home', name: 'home', component: Home },

    // 群組
    { path: '/groups', name: 'myGroups', component: Home },
    { path: '/groups/new', name: 'newGroups', component: Home },

    // 朋友
    { path: '/friend/:friend', name: 'friend', component: Friend },

    // 其他
    { path: '/setting', name: 'setting', component: Setting },
    { path: '/about', name: 'about', component: About },
    { path: '/template', name: 'template', component: Template }
  ],
  nav_items: [
    {
      categoryName: '群組',
      items: [
        { name: '我的群組', url: '/groups', icon: <PeopleIcon /> },
        { name: '新增群組', url: '/groups/new', icon: <PeopleIcon /> }
      ]
    },
    {
      categoryName: '其他',
      items: [
        { name: '設定', url: '/setting', icon: <SettingsIcon /> },
        { name: '關於', url: '/about', icon: <PeopleIcon /> },
        { name: '模板', url: '/template', icon: <PeopleIcon /> },
      ]
    }

  ]
}