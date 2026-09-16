using System;
using System.Drawing;
using System.Drawing.Imaging;

class Program {
    static void Main() {
        using (Bitmap master = new Bitmap("skate_2.png")) {
            Action<string, Rectangle> cropAndSave = (filename, rect) => {
                int minX = rect.Right, maxX = rect.Left, minY = rect.Bottom, maxY = rect.Top;
                for (int y = rect.Top; y < rect.Bottom; y++) {
                    for (int x = rect.Left; x < rect.Right; x++) {
                        if (x >= 0 && x < master.Width && y >= 0 && y < master.Height) {
                            if (master.GetPixel(x, y).A > 25) {
                                if (x < minX) minX = x;
                                if (x > maxX) maxX = x;
                                if (y < minY) minY = y;
                                if (y > maxY) maxY = y;
                            }
                        }
                    }
                }

                if (maxX >= minX && maxY >= minY) {
                    int w = maxX - minX + 1;
                    int h = maxY - minY + 1;
                    using (Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                        for (int y = 0; y < h; y++) {
                            for (int x = 0; x < w; x++) {
                                bmp.SetPixel(x, y, master.GetPixel(minX + x, minY + y));
                            }
                        }
                        bmp.Save(filename, ImageFormat.Png);
                        Console.WriteLine("Saved " + filename + " (" + w + "x" + h + ")");
                    }
                } else {
                    Console.WriteLine("Warning: empty rect for " + filename);
                }
            };

            // ZORP SPRITES
            cropAndSave("zorp_skate_idle.png", new Rectangle(20, 20, 85, 140));
            cropAndSave("zorp_skate_cruise.png", new Rectangle(120, 20, 85, 140));
            cropAndSave("zorp_skate_push.png", new Rectangle(220, 20, 90, 140));
            cropAndSave("zorp_skate_brake.png", new Rectangle(325, 20, 90, 140));
            
            cropAndSave("zorp_skate_ollie.png", new Rectangle(30, 190, 80, 110));
            cropAndSave("zorp_skate_heelflip.png", new Rectangle(130, 175, 75, 125));
            cropAndSave("zorp_skate_kickflip.png", new Rectangle(220, 185, 90, 115));
            cropAndSave("zorp_skate_special.png", new Rectangle(320, 170, 95, 135));

            cropAndSave("zorp_skate_grind.png", new Rectangle(30, 305, 85, 110));
            cropAndSave("zorp_skate_slide.png", new Rectangle(460, 310, 110, 120));

            cropAndSave("zorp_skate_fall.png", new Rectangle(620, 505, 105, 60));
            cropAndSave("zorp_skate_stumble.png", new Rectangle(525, 480, 85, 90));

            // MESTRE SPRITES
            cropAndSave("mestre_skate_idle.png", new Rectangle(30, 605, 70, 100));
            cropAndSave("npc_mestre_skate.png", new Rectangle(30, 605, 70, 100));
            cropAndSave("mestre_skate_cruise.png", new Rectangle(260, 605, 70, 95));
            cropAndSave("mestre_skate_push.png", new Rectangle(345, 600, 75, 100));
            cropAndSave("mestre_skate_brake.png", new Rectangle(430, 600, 75, 100));

            cropAndSave("mestre_skate_ollie.png", new Rectangle(20, 720, 65, 95));
            cropAndSave("mestre_skate_heelflip.png", new Rectangle(100, 715, 60, 95));
            cropAndSave("mestre_skate_kickflip.png", new Rectangle(175, 715, 65, 95));
            cropAndSave("mestre_skate_special.png", new Rectangle(325, 720, 65, 95));

            cropAndSave("mestre_skate_grind.png", new Rectangle(780, 720, 80, 90));
            cropAndSave("mestre_skate_fall.png", new Rectangle(1160, 955, 130, 55));
            cropAndSave("mestre_skate_dazed.png", new Rectangle(820, 955, 100, 50));
        }

        // Also crop Win celebration and Crash FX from skate_3.png if possible
        using (Bitmap master3 = new Bitmap("skate_3.png")) {
            // Check bottom area
            Action<string, Rectangle> cropAndSaveDark = (filename, rect) => {
                // Color key out pure black/very dark background if needed, or tight box
                int w = rect.Width;
                int h = rect.Height;
                using (Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                    for (int y = 0; y < h; y++) {
                        for (int x = 0; x < w; x++) {
                            int srcX = rect.Left + x;
                            int srcY = rect.Top + y;
                            if (srcX >= 0 && srcX < master3.Width && srcY >= 0 && srcY < master3.Height) {
                                Color c = master3.GetPixel(srcX, srcY);
                                // If near background color (dark blue/black), make transparent
                                if (c.R < 25 && c.G < 25 && c.B < 40) {
                                    bmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                                } else {
                                    bmp.SetPixel(x, y, c);
                                }
                            }
                        }
                    }
                    bmp.Save(filename, ImageFormat.Png);
                    Console.WriteLine("Saved from skate_3: " + filename);
                }
            };

            // Zorp victory comemorando
            cropAndSaveDark("zorp_skate_win.png", new Rectangle(165, 630, 48, 70));
            // Mestre victory/cheer
            cropAndSaveDark("mestre_skate_cheer.png", new Rectangle(430, 630, 48, 70));
            // Special crash clouds
            cropAndSaveDark("skate_fx_smoke.png", new Rectangle(680, 465, 60, 65));
            cropAndSaveDark("skate_fx_spark.png", new Rectangle(745, 465, 60, 65));
            cropAndSaveDark("skate_fx_star.png", new Rectangle(805, 465, 55, 65));
            // Zorp Neon Finalization
            cropAndSaveDark("zorp_skate_final_spin.png", new Rectangle(380, 780, 105, 140));
            // Mestre Finalization
            cropAndSaveDark("mestre_skate_final_spin.png", new Rectangle(500, 780, 105, 140));
        }
    }
}
