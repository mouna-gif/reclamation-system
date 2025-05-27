// Dans services/api.js (backend), ajoutez temporairement :
router.post('/slas/seed', async (req, res) => {
    try {
      await SLA.deleteMany({});
      
      const testSLAs = [
        { category: "Technique", durationHours: 48, escalationEmail: "tech@example.com" },
        { category: "Service", durationHours: 24, escalationEmail: "service@example.com" },
        { category: "Produit", durationHours: 72, escalationEmail: "produit@example.com" }
      ];
      
      await SLA.insertMany(testSLAs);
      res.json({ message: "SLAs créés avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });