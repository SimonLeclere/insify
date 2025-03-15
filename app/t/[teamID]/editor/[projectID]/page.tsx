import { PlateEditor } from '@/components/editor/plate-editor';

export default function Page() {
  return (
    <div className="h-screen w-full" data-registry="plate">
      {/* TODO: fix hydratation error when on mobile sized screen */}
      <PlateEditor />
    </div>
  );
}
