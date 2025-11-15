export function fuzzySearch<T extends { name: string; [key: string]: any }>(query: string, items: T[]): T[] {
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  
  return items
    .filter(item => item.name.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      const aPos = a.name.toLowerCase().indexOf(lowerQuery);
      const bPos = b.name.toLowerCase().indexOf(lowerQuery);
      return aPos - bPos;
    })
    .slice(0, 5);
}
