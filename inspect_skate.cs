using System;
using System.Drawing;
using System.Collections.Generic;

class RectComparer : IComparer<Rectangle> {
    public int Compare(Rectangle r1, Rectangle r2) {
        int row1 = r1.Y / 80;
        int row2 = r2.Y / 80;
        if (row1 != row2) return row1.CompareTo(row2);
        return r1.X.CompareTo(r2.X);
    }
}

class Program {
    static void Main() {
        using (Bitmap bmp = new Bitmap("skate_2.png")) {
            int w = bmp.Width;
            int h = bmp.Height;
            bool[,] visited = new bool[w, h];
            List<Rectangle> rects = new List<Rectangle>();

            for (int y = 0; y < h; y += 3) {
                for (int x = 0; x < w; x += 3) {
                    if (!visited[x, y] && bmp.GetPixel(x, y).A > 20) {
                        int minX = x, maxX = x, minY = y, maxY = y;
                        Queue<Point> q = new Queue<Point>();
                        q.Enqueue(new Point(x, y));
                        visited[x, y] = true;

                        while (q.Count > 0) {
                            Point pt = q.Dequeue();
                            if (pt.X < minX) minX = pt.X;
                            if (pt.X > maxX) maxX = pt.X;
                            if (pt.Y < minY) minY = pt.Y;
                            if (pt.Y > maxY) maxY = pt.Y;

                            int[] dx = { -3, 3, 0, 0 };
                            int[] dy = { 0, 0, -3, 3 };
                            for (int i = 0; i < 4; i++) {
                                int nx = pt.X + dx[i];
                                int ny = pt.Y + dy[i];
                                if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                                    visited[nx, ny] = true;
                                    if (bmp.GetPixel(nx, ny).A > 20) {
                                        q.Enqueue(new Point(nx, ny));
                                    }
                                }
                            }
                        }

                        int rw = maxX - minX + 1;
                        int rh = maxY - minY + 1;
                        if (rw > 15 && rh > 15) {
                            rects.Add(new Rectangle(minX, minY, rw, rh));
                        }
                    }
                }
            }

            List<Rectangle> merged = new List<Rectangle>(rects);
            bool changed = true;
            while (changed) {
                changed = false;
                for (int i = 0; i < merged.Count; i++) {
                    for (int j = i + 1; j < merged.Count; j++) {
                        Rectangle r1 = merged[i];
                        Rectangle r2 = merged[j];
                        Rectangle expanded = new Rectangle(r1.X - 12, r1.Y - 12, r1.Width + 24, r1.Height + 24);
                        if (expanded.IntersectsWith(r2)) {
                            int nx = Math.Min(r1.X, r2.X);
                            int ny = Math.Min(r1.Y, r2.Y);
                            int nw = Math.Max(r1.Right, r2.Right) - nx;
                            int nh = Math.Max(r1.Bottom, r2.Bottom) - ny;
                            merged[i] = new Rectangle(nx, ny, nw, nh);
                            merged.RemoveAt(j);
                            changed = true;
                            break;
                        }
                    }
                    if (changed) break;
                }
            }

            merged.Sort(new RectComparer());

            for (int i = 0; i < merged.Count; i++) {
                Rectangle r = merged[i];
                Console.WriteLine(string.Format("Sprite {0:D2}: X={1}, Y={2}, W={3}, H={4}", i, r.X, r.Y, r.Width, r.Height));
            }
        }
    }
}
