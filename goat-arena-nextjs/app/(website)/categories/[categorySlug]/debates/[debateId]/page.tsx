"use client";

import { useParams } from 'next/navigation';
import { DebateDetail } from '@/components/debates/DebateDetail';

export default function CategoryDebatePage() {
    const params = useParams();
    const debateId = params.debateId as string;

    return <DebateDetail debateId={debateId} />;
}
