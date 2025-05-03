
class BatterySOHModel:
    """Modello semplificato di State‑of‑Health basato su cicli equivalenti."""
    def __init__(self, capacity_Wh, cycle_life=500, EOL_capacity=0.8):
        self.nominal_capacity = capacity_Wh
        self.SOH = 1.0  # 100% capacità iniziale
        self.avg_decay = (1 - EOL_capacity) / cycle_life

    def apply_usage(self, used_Wh):
        frac_cycle = used_Wh / self.nominal_capacity
        self.SOH -= self.avg_decay * frac_cycle
        self.SOH = max(self.SOH, 0.0)

    @property
    def capacity_now(self):
        return self.nominal_capacity * self.SOH
