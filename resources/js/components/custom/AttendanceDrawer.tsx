import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { User } from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loading: boolean;
    students: any[];
    editingRow: any;
    onChangeStudents: (students: any[]) => void;
    onSave: () => Promise<void>;
}

export default function AttendanceDrawer({
    open,
    onOpenChange,
    loading,
    students,
    editingRow,
    onChangeStudents,
    onSave,
}: Props) {
    const presentCount = students.filter((s) => s.status === 'present').length;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[90vh] rounded-t-2xl border-t bg-white dark:bg-slate-950">
                <DrawerHeader className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                    <DrawerTitle className="text-xl font-semibold">
                        Edit Attendance
                    </DrawerTitle>
                    <DrawerDescription className="text-sm">
                        {editingRow && (
                            <>
                                Class {editingRow.class.name} · Section{' '}
                                {editingRow.section.name}
                                <br />
                                {new Date(
                                    editingRow.attendance_date,
                                ).toDateString()}
                            </>
                        )}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="mt-4 flex-1 overflow-y-auto px-4">
                    {loading ? (
                        <div className="py-20 text-center text-sm text-slate-500">
                            Loading attendance…
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900">
                                            <User size={14} />
                                        </div>
                                        <span className="font-medium">
                                            {student.name}
                                        </span>
                                    </div>

                                    <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                                        {['present', 'absent'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() =>
                                                    onChangeStudents(
                                                        students.map((s) =>
                                                            s.id === student.id
                                                                ? {
                                                                      ...s,
                                                                      status,
                                                                  }
                                                                : s,
                                                        ),
                                                    )
                                                }
                                                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                                    student.status === status
                                                        ? status === 'present'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-red-600 text-white'
                                                        : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DrawerFooter className="border-t bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex gap-2">
                        <Button
                            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                            onClick={onSave}
                        >
                            Save Changes
                        </Button>

                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
