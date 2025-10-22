import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { getEvents } from '../api/emqx'
import type { EmqxWebhookEvent, Page } from '../types'

export default function Events() {
    const [size, setSize] = useState(10)
    const [pageIdx, setPageIdx] = useState(0)
    const [page, setPage] = useState<Page<EmqxWebhookEvent> | null>(null)
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    async function load(p = pageIdx, s = size) {
        setLoading(true)
        setErr(null)
        try {
            const data = await getEvents({ page: p, size: s })
            setPageIdx(data.number)
            setPage(data)
        } catch (e: any) {
            setErr('加载失败，请确认已登录且后端可用')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load(0, size) }, [size])

    function prev() { if (pageIdx > 0) load(pageIdx - 1, size) }
    function next() { if (page && pageIdx < page.totalPages - 1) load(pageIdx + 1, size) }

    return (
        <div className="space-y-4">
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <h2 className="font-semibold">事件列表</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">每页</span>
                        <select className="input !w-24" value={size} onChange={e => setSize(Number(e.target.value))}>
                            {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <button className="btn btn-ghost" onClick={() => load()}>刷新</button>
                    </div>
                </div>

                {err && <div className="text-red-600 text-sm mt-3">{err}</div>}

                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-600">
                            <th className="py-2 pr-4">ID</th>
                            <th className="py-2 pr-4">类型</th>
                            <th className="py-2 pr-4">名称</th>
                            <th className="py-2 pr-4">消息</th>
                            <th className="py-2 pr-4">创建时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        {page?.content?.map(e => (
                            <tr key={e.id} className="border-t">
                                <td className="py-2 pr-4">{e.id}</td>
                                <td className="py-2 pr-4"><span className="badge border-agri-300 text-agri-800 bg-agri-50">{e.event}</span></td>
                                <td className="py-2 pr-4">{e.name}</td>
                                <td className="py-2 pr-4">{e.message}</td>
                                <td className="py-2 pr-4">{dayjs(e.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                        ))}
                        {(!page || page.content.length === 0) && (
                            <tr><td colSpan={5} className="py-6 text-center text-gray-500">暂无数据</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        第 <b>{(page?.number ?? 0) + 1}</b> / <b>{page?.totalPages ?? 1}</b> 页，
                        共 <b>{page?.totalElements ?? 0}</b> 条
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-ghost" onClick={prev} disabled={loading || pageIdx === 0}>上一页</button>
                        <button className="btn btn-primary" onClick={next} disabled={loading || !page || pageIdx >= page.totalPages - 1}>下一页</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
