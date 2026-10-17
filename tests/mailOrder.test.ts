
import { validateAddress, generateSimulatedMailOrder, processMailOrder } from "../src/pages/api/create-mail-order";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function runTests() {
  console.log("\n▸ Address Validation Tests");
  const validTenant = {
    name: "Jane Doe",
    addressLine1: "123 Main St, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
  };
  const v1 = validateAddress(validTenant);
  assert(v1.valid, "Valid address should pass validation");
  assert(v1.errors.length === 0, "Valid address has 0 errors");

  const invalidAddress = {
    name: "",
    addressLine1: "12",
    city: "",
    state: "CALIFORNIA",
    zip: "123",
  };
  const v2 = validateAddress(invalidAddress);
  assert(!v2.valid, "Invalid address should fail validation");
  assert(v2.errors.length === 5, "Should return 5 errors for missing fields");
  console.log("  ✓ Address validation works correctly");

  console.log("\n▸ Simulated Certified Mail Dispatch Tests");
  const validLandlord = {
    name: "Acme Property Management Inc.",
    addressLine1: "500 Market St, Suite 1200",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
  };
  const sim = generateSimulatedMailOrder({
    tenantAddress: validTenant,
    landlordAddress: validLandlord,
    letterContent: "Demand for return of security deposit pursuant to Cal. Civ. Code § 1950.5",
    stateCode: "CA",
    totalClaimAmount: 4500,
  });

  assert(sim.success === true, "Simulated order must succeed");
  assert(sim.mode === "simulated", "Mode must be simulated");
  assert(sim.trackingNumber.startsWith("7023 "), "Tracking number must begin with USPS Certified prefix 7023");
  assert(sim.carrier === "USPS", "Carrier must be USPS");
  assert(sim.costUsd === 29.99, "Cost must be $29.99");
  assert(Boolean(sim.estimatedDeliveryDate), "Must provide estimated delivery date");
  assert(Boolean(sim.orderId), "Must generate orderId");
  console.log("  ✓ Simulated fulfillment outputs verified barcode & delivery date");

  console.log("\n▸ Unified processMailOrder Client/Server Pipeline");
  const processed = await processMailOrder({
    tenantAddress: validTenant,
    landlordAddress: validLandlord,
    letterContent: "Formal demand letter",
    stateCode: "CA",
    isTestMode: true,
  });
  assert(processed.success === true, "processMailOrder succeeds in test mode");
  assert(processed.trackingNumber.length > 15, "Tracking number is present");
  console.log("  ✓ processMailOrder completes successfully");

  console.log("\n━━━ All Mail Order tests passed! ━━━\n");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
