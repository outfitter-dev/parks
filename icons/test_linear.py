"""Exercise the same command used to check a study."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
MASTER = HERE / "studies/trail-cairn/linear.svg"


class LinearCheck(unittest.TestCase):
    def test_sample(self):
        subprocess.run([sys.executable, HERE / "check-linear.py", MASTER], check=True)

    def test_invalid_candidates(self):
        source = MASTER.read_text()
        cases = [source.replace('1.5"', '2"', 1),
                 source.replace("<path ", '<path style="fill:red" ', 1),
                 source.replace("<path ", "<image ", 1),
                 source.split("<path")[0] + "</svg>", "<svg"]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "candidate.svg"
            for svg in cases:
                with self.subTest(svg=svg):
                    path.write_text(svg)
                    result = subprocess.run(
                        [sys.executable, HERE / "check-linear.py", MASTER, path],
                        capture_output=True, text=True,
                    )
                    self.assertEqual(result.returncode, 1)
                    self.assertIn(str(path), result.stderr)


if __name__ == "__main__":
    unittest.main()
