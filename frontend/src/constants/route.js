import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import Home from '../component/page/Home'
import Friend from '../component/page/Friend'
import Group from '../component/page/Group'
import Setting from '../component/page/Setting'
import About from '../component/page/About'
import Template from '../component/page/template'
import Account from '../component/page/Account'

export default {
  route: [
    // 首頁
    { path: '/home', name: 'home', component: Home },

    // 群組
    // { path: '/groups', name: 'myGroups', component: Group },
    { path: '/group/:groupName/:id', name: 'group', component: Group },

    // 朋友
    { path: '/friend/:friend', name: 'friend', component: Friend },

    // 其他
    { path: '/setting', name: 'setting', component: Setting },
    { path: '/about', name: 'about', component: About },
    { path: '/account', name: 'account', component: Account },
    { path: '/template', name: 'template', component: Template },
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