import defaultSettings from '@/settings'

const title = defaultSettings.title || '经管雄起后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
