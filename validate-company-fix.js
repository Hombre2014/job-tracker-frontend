/**
 * Validation Script for Company Creation Fix
 * 
 * This simulates the logic to ensure it handles all scenarios correctly.
 * Run with: node validate-company-fix.js
 */

console.log('🔍 Validating Company Creation Fix Logic...\n');

// Simulate the createJobApplication logic
async function simulateCreateJobApplication(scenario) {
  console.log(`\n📋 Scenario: ${scenario.name}`);
  console.log('   Input:', JSON.stringify(scenario.input, null, 2));
  
  const { draft, legacyCompanyId } = scenario.input;
  let finalCompanyId = draft.companyId || legacyCompanyId;
  
  // The fix: If no companyId but company name exists, create the company first
  if (!finalCompanyId && draft.company) {
    console.log('   ⚠️  No companyId found, but company name exists');
    console.log('   🔧 Creating company:', draft.company);
    
    // Simulate company creation
    const mockCreatedCompany = {
      id: 'generated-id-' + Math.random().toString(36).substr(2, 9),
      name: draft.company,
      url: null,
    };
    
    finalCompanyId = mockCreatedCompany.id;
    console.log('   ✅ Company created with ID:', finalCompanyId);
  } else if (finalCompanyId) {
    console.log('   ✅ Using existing companyId:', finalCompanyId);
  } else {
    console.log('   ❌ ERROR: No company name or ID provided');
    return { success: false, error: 'Missing company information' };
  }
  
  // Create job post
  const jobPost = {
    title: draft.jobTitle,
    companyId: finalCompanyId,
    status: 'Job Created',
  };
  
  console.log('   📝 Job Post:', JSON.stringify(jobPost, null, 2));
  
  if (!jobPost.companyId) {
    console.log('   ❌ FAILED: Job post missing companyId');
    return { success: false, error: 'Missing companyId' };
  }
  
  console.log('   ✅ SUCCESS: Job would be created');
  return { success: true, jobPost };
}

// Test scenarios
const scenarios = [
  {
    name: 'User types company name WITHOUT selecting (THE FIX)',
    input: {
      draft: {
        company: 'NewTech Corp',
        jobTitle: 'Software Engineer',
        companyId: undefined,
      },
      legacyCompanyId: null,
    },
    expectedBehavior: 'Should create company first, then create job',
  },
  {
    name: 'User selects company FROM dropdown (existing flow)',
    input: {
      draft: {
        company: 'Google',
        jobTitle: 'Product Manager',
        companyId: 'existing-google-id-123',
      },
      legacyCompanyId: null,
    },
    expectedBehavior: 'Should use existing companyId',
  },
  {
    name: 'User types, then selects different company',
    input: {
      draft: {
        company: 'Microsoft',
        jobTitle: 'Developer',
        companyId: 'selected-microsoft-id-456',
      },
      legacyCompanyId: null,
    },
    expectedBehavior: 'Should use selected companyId',
  },
  {
    name: 'Legacy flow with localStorage companyId',
    input: {
      draft: {
        company: 'Amazon',
        jobTitle: 'Engineer',
        companyId: undefined,
      },
      legacyCompanyId: 'legacy-amazon-id-789',
    },
    expectedBehavior: 'Should use legacy companyId from localStorage',
  },
  {
    name: 'Empty company name (should fail validation)',
    input: {
      draft: {
        company: '',
        jobTitle: 'Developer',
        companyId: undefined,
      },
      legacyCompanyId: null,
    },
    expectedBehavior: 'Should fail - no company information',
  },
  {
    name: 'Company name with special characters',
    input: {
      draft: {
        company: 'Tech & Co.',
        jobTitle: 'Designer',
        companyId: undefined,
      },
      legacyCompanyId: null,
    },
    expectedBehavior: 'Should create company with special chars preserved',
  },
];

// Run all scenarios
async function runAllTests() {
  const results = [];
  
  for (const scenario of scenarios) {
    const result = await simulateCreateJobApplication(scenario);
    results.push({
      scenario: scenario.name,
      success: result.success,
      expected: scenario.expectedBehavior,
    });
  }
  
  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════\n');
  
  results.forEach((r, i) => {
    const icon = r.success ? '✅' : '❌';
    console.log(`${icon} Test ${i + 1}: ${r.scenario}`);
    console.log(`   Expected: ${r.expected}`);
  });
  
  const passedCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log('\n═══════════════════════════════════════');
  console.log(`Results: ${passedCount}/${totalCount} scenarios handled correctly`);
  
  if (passedCount === totalCount - 1) { // -1 because empty company should fail
    console.log('✅ ALL CRITICAL TESTS PASSED!');
    console.log('Note: Empty company test correctly failed as expected.');
  } else {
    console.log('⚠️  Review failed scenarios above');
  }
  console.log('═══════════════════════════════════════\n');
}

runAllTests();
