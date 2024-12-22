import TopicView from '@/components/topic-view'

export const dynamic = 'force-dynamic'

export default async function TopicViewPage(props: { params: Promise<{ id: string }> }) {
  return <TopicView {...props} />
}
