import getStatItems from "../../store/super-admin/getStatItems";
import { useStatsStore } from "../../store/super-admin/useStatsStore";

const QuickStats = ({ category }: { category: string }) => {
  const { stats, isLoading } = useStatsStore();

  return getStatItems(category, isLoading, stats[category] ?? null);
};
export default QuickStats;
